"use client";

/* eslint-disable react-hooks/immutability -- imperative HTMLVideoElement
   manipulation (pause/seek/mute/play) targets the DOM, an external system;
   the React Compiler rule false-positives on these standard video APIs. */

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";
import Link from "next/link";
import { fetchApi } from "@/lib/api-client";
import type { DramaDetail, Episode, StreamResult } from "@/lib/nunomix/types";
import { saveContinue, useContinueList } from "@/lib/storage";
import {
  IconChevronDown,
  IconChevronLeft,
  IconFilm,
  IconMaximize,
  IconMinimize,
  IconPlay,
  IconRefresh,
  IconVolume,
  IconVolumeMute,
  IconX,
} from "./Icons";

interface ReelsPlayerProps {
  drama: DramaDetail | null;
  episodes: Episode[];
  initialEpisode: number;
  /** Stream resolved on the server for the initial episode (saves a round-trip). */
  initialStream: StreamResult | null;
}

interface StreamMap {
  [epNumber: number]: StreamResult;
}

/** Per-episode UI state — kept in a map so switching episodes is pure derivation. */
interface EpState {
  waiting: boolean;
  playing: boolean;
  current: number;
  duration: number;
  ended: boolean;
}
const DEFAULT_EP_STATE: EpState = {
  waiting: true,
  playing: false,
  current: 0,
  duration: 0,
  ended: false,
};

function fmtTime(s: number): string {
  if (!Number.isFinite(s) || s < 0) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, "0")}`;
}

/**
 * REELS PLAYER — TikTok / Melolo / ReelShort style.
 *
 * One episode per full screen; swipe (or wheel) UP for the next episode.
 * The UI hides itself so the video owns the whole screen; a single tap
 * pauses and brings the controls back.
 */
export function ReelsPlayer({
  drama,
  episodes,
  initialEpisode,
  initialStream,
}: ReelsPlayerProps) {
  const vodId = drama?.vodId ?? "";

  const initialIndex = Math.max(
    0,
    episodes.findIndex((e) => e.number === initialEpisode),
  );

  const [active, setActive] = useState(initialIndex);
  const [streams, setStreams] = useState<StreamMap>(
    initialStream ? { [initialEpisode]: initialStream } : {},
  );
  const [loadingEps, setLoadingEps] = useState<Record<number, boolean>>({});
  const [errorEps, setErrorEps] = useState<Record<number, boolean>>({});
  const [retryTick, setRetryTick] = useState(0);
  const [epStates, setEpStates] = useState<Record<number, EpState>>({});

  const [uiVisible, setUiVisible] = useState(true);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  const [burst, setBurst] = useState<{ id: number } | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRefs = useRef<Map<number, HTMLVideoElement>>(new Map());
  const prevIndexRef = useRef(initialIndex);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSaveRef = useRef(0);
  const pendingRef = useRef<Set<number>>(new Set());
  const activeRef = useRef(initialIndex);
  const streamsRef = useRef<StreamMap>(streams);
  const entries = useContinueList();
  const entriesRef = useRef(entries);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);
  useEffect(() => {
    streamsRef.current = streams;
  }, [streams]);
  useEffect(() => {
    entriesRef.current = entries;
  }, [entries]);

  const activeEp = episodes[active];
  const activeSt: EpState = activeEp
    ? (epStates[activeEp.number] ?? DEFAULT_EP_STATE)
    : DEFAULT_EP_STATE;

  const patchEp = useCallback(
    (epNumber: number, patch: Partial<EpState>) => {
      setEpStates((m) => ({
        ...m,
        [epNumber]: { ...(m[epNumber] ?? DEFAULT_EP_STATE), ...patch },
      }));
    },
    [],
  );

  /* ------------------------- stream loading ------------------------- */

  const loadStream = useCallback(
    (epNumber: number, force = false) => {
      if (!vodId || pendingRef.current.has(epNumber)) return;
      if (streamsRef.current[epNumber] && !force) return;
      pendingRef.current.add(epNumber);
      setLoadingEps((s) => ({ ...s, [epNumber]: true }));
      fetchApi<{ stream: StreamResult }>(
        `/api/stream?vod_id=${encodeURIComponent(vodId)}&episode=${epNumber}`,
      )
        .then((data) => {
          setStreams((s) => ({ ...s, [epNumber]: data.stream }));
          setErrorEps((s) => {
            if (!s[epNumber]) return s;
            const n = { ...s };
            delete n[epNumber];
            return n;
          });
        })
        .catch((err) => {
          console.error("[vandream:reels] stream failed", epNumber, err);
          setErrorEps((s) => ({ ...s, [epNumber]: true }));
        })
        .finally(() => {
          pendingRef.current.delete(epNumber);
          setLoadingEps((s) => {
            const n = { ...s };
            delete n[epNumber];
            return n;
          });
        });
    },
    [vodId],
  );

  // Keep the current episode + immediate neighbors ready (TikTok-style preload).
  useEffect(() => {
    for (const i of [active, active + 1, active - 1]) {
      const ep = episodes[i];
      if (ep) loadStream(ep.number);
    }
  }, [active, episodes, loadStream, retryTick]);

  /* ------------------------- progress persistence ------------------------- */

  const saveProgress = useCallback(
    (force = false) => {
      if (!drama || !activeEp) return;
      const v = videoRefs.current.get(activeEp.number);
      if (!v) return;
      const d = v.duration;
      const t = v.currentTime;
      if (!Number.isFinite(d) || d <= 0 || t < 5) return;
      const now = Date.now();
      if (!force && now - lastSaveRef.current < 4000) return;
      lastSaveRef.current = now;
      saveContinue({
        vodId: drama.vodId,
        episode: activeEp.number,
        progress: t / d,
        currentPos: t,
        duration: d,
        title: drama.title,
        poster: drama.poster,
        updatedAt: now,
      });
    },
    [drama, activeEp],
  );

  /* ------------------------- active episode change ------------------------- */

  useEffect(() => {
    const ep = episodes[active];
    if (!ep) return;

    // Persist the previous episode's position before switching.
    const prevIdx = prevIndexRef.current;
    prevIndexRef.current = active;
    const prevEp = episodes[prevIdx];
    if (drama && prevEp && prevIdx !== active) {
      const pv = videoRefs.current.get(prevEp.number);
      if (
        pv &&
        Number.isFinite(pv.duration) &&
        pv.duration > 0 &&
        pv.currentTime > 5
      ) {
        saveContinue({
          vodId: drama.vodId,
          episode: prevEp.number,
          progress: pv.currentTime / pv.duration,
          currentPos: pv.currentTime,
          duration: pv.duration,
          title: drama.title,
          poster: drama.poster,
          updatedAt: Date.now(),
        });
      }
    }

    // Pause the others; release far-away videos to free bandwidth/memory.
    const timer = setTimeout(() => {
      for (const [num, v] of videoRefs.current.entries()) {
        if (num === ep.number) continue;
        v.pause();
        const idx = episodes.findIndex((e) => e.number === num);
        if (idx !== -1 && Math.abs(idx - active) > 2) {
          v.removeAttribute("src");
          v.load();
        }
      }
    }, 120);

    return () => clearTimeout(timer);
  }, [active, episodes, drama]);

  // Start (or resume) playback for the active episode — fires when its
  // stream arrives and when the user scrolls to a preloaded episode.
  useEffect(() => {
    const ep = episodes[active];
    if (!ep || !streams[ep.number]) return;
    const v = videoRefs.current.get(ep.number);
    if (!v || !v.paused || v.ended) return;
    void v
      .play()
      .catch(() => {
        // autoplay blocked → begin muted so the show still starts
        v.muted = true;
        setMuted(true);
        v.play().catch(() => {
          patchEp(ep.number, { waiting: false });
          setUiVisible(true);
        });
      });
  }, [active, streams, episodes, patchEp]);

  // Apply resume position when metadata is ready.
  const onLoadedMetadata = useCallback(
    (epNumber: number, v: HTMLVideoElement) => {
      if (episodes[activeRef.current]?.number !== epNumber) return;
      patchEp(epNumber, { duration: v.duration || 0, waiting: false });
      setVolume(v.volume);
      setMuted(v.muted);
      const entry = entriesRef.current.find(
        (e) =>
          e.vodId === vodId &&
          e.episode === epNumber &&
          e.currentPos > 15 &&
          Number.isFinite(v.duration) &&
          e.currentPos < v.duration - 15,
      );
      if (entry) v.currentTime = entry.currentPos;
    },
    [episodes, vodId, patchEp],
  );

  /* ------------------------- scroll → active ------------------------- */

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const idx = Math.max(
          0,
          Math.min(
            episodes.length - 1,
            Math.round(el.scrollTop / Math.max(1, el.clientHeight)),
          ),
        );
        if (idx !== activeRef.current) setActive(idx);
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [episodes.length]);

  const scrollTo = useCallback(
    (i: number, smooth = true) => {
      const el = containerRef.current;
      if (!el) return;
      const clamped = Math.max(0, Math.min(episodes.length - 1, i));
      el.scrollTo({
        top: clamped * el.clientHeight,
        behavior: smooth ? "smooth" : "auto",
      });
    },
    [episodes.length],
  );

  /* ------------------------- UI visibility ------------------------- */

  const bumpUi = useCallback(() => {
    setUiVisible(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => setUiVisible(false), 3200);
  }, []);

  useEffect(() => {
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  /* ------------------------- fullscreen ------------------------- */

  useEffect(() => {
    const onChange = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggleFullscreen = useCallback(() => {
    const el = containerRef.current?.children[activeRef.current] as
      | HTMLElement
      | undefined;
    if (!el) return;
    if (document.fullscreenElement) {
      void document.exitFullscreen().catch(() => undefined);
    } else {
      void el.requestFullscreen().catch(() => undefined);
    }
  }, []);

  /* ------------------------- player actions ------------------------- */

  const togglePlay = useCallback(() => {
    const ep = episodes[activeRef.current];
    const v = ep && videoRefs.current.get(ep.number);
    if (!v || !ep) return;
    if (v.paused || v.ended) {
      patchEp(ep.number, { ended: false });
      void v.play().catch(() => undefined);
    } else {
      v.pause();
    }
  }, [episodes, patchEp]);

  const toggleMute = useCallback(() => {
    const ep = episodes[activeRef.current];
    const v = ep && videoRefs.current.get(ep.number);
    const m = !v?.muted;
    if (v) v.muted = m;
    setMuted(m);
  }, [episodes]);

  const seekBy = useCallback(
    (delta: number) => {
      const ep = episodes[activeRef.current];
      const v = ep && videoRefs.current.get(ep.number);
      if (!v || !Number.isFinite(v.duration)) return;
      v.currentTime = Math.min(Math.max(0, v.currentTime + delta), v.duration);
    },
    [episodes],
  );

  const onEnded = useCallback(
    (epNumber: number) => {
      if (episodes[activeRef.current]?.number !== epNumber) return;
      patchEp(epNumber, { ended: true, playing: false });
      saveProgress(true);
      // auto-advance to the next episode, TikTok-style
      setTimeout(() => {
        if (activeRef.current < episodes.length - 1) {
          scrollTo(activeRef.current + 1);
        }
      }, 900);
    },
    [episodes, saveProgress, scrollTo, patchEp],
  );

  // Save final position on unmount.
  useEffect(() => {
    return () => saveProgress(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ------------------------- tap handling ------------------------- */

  const lastTapRef = useRef(0);
  const onTap = useCallback(
    (e: ReactMouseEvent<HTMLDivElement>) => {
      if ((e.target as HTMLElement).closest("[data-ctl]")) return;
      const now = Date.now();
      const isDouble = now - lastTapRef.current < 300;
      lastTapRef.current = now;
      if (isDouble) {
        setBurst({ id: now });
        setTimeout(() => setBurst(null), 950);
        return;
      }
      togglePlay();
      bumpUi();
    },
    [togglePlay, bumpUi],
  );

  const onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case " ":
      case "k":
        e.preventDefault();
        togglePlay();
        bumpUi();
        break;
      case "f":
        toggleFullscreen();
        break;
      case "m":
        toggleMute();
        break;
      case "ArrowDown":
      case "PageDown":
        e.preventDefault();
        if (active < episodes.length - 1) scrollTo(active + 1);
        break;
      case "ArrowUp":
      case "PageUp":
        e.preventDefault();
        if (active > 0) scrollTo(active - 1);
        break;
      case "ArrowRight":
        e.preventDefault();
        seekBy(10);
        break;
      case "ArrowLeft":
        e.preventDefault();
        seekBy(-10);
        break;
      default:
        return;
    }
  };

  /* ------------------------- render ------------------------- */

  const activeError = activeEp ? Boolean(errorEps[activeEp.number]) : false;
  const st = activeSt;
  const showControls = uiVisible || !st.playing || activeError;

  if (episodes.length === 0) {
    return (
      <div className="grid min-h-dvh place-items-center bg-black px-6">
        <div className="glass max-w-md px-8 py-12 text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-rose/40 bg-rose/10 text-rose">
            <IconX size={22} />
          </span>
          <h1 className="mt-4 font-display text-xl text-ivory">
            Video tidak dapat diputar.
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-mist">
            Daftar episode untuk drama ini tidak tersedia saat ini.
          </p>
          {drama && (
            <Link
              href={`/drama/${drama.vodId}`}
              className="btn-gold mt-6 px-6 py-3"
            >
              <IconChevronLeft size={15} />
              Halaman Drama
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      role="region"
      aria-label={`Pemutar reels — ${drama?.title ?? "drama"}`}
      onKeyDown={onKeyDown}
      onMouseMove={() => st.playing && bumpUi()}
      className="reels-scroll bg-black outline-none"
    >
      {episodes.map((ep, i) => {
        const isNeighbor = i === active + 1;
        const eps = streams[ep.number];
        const isLoading = Boolean(loadingEps[ep.number]);
        const hasError = Boolean(errorEps[ep.number]);
        const isActive = i === active;
        const eSt = epStates[ep.number] ?? DEFAULT_EP_STATE;
        const showThisUi = isActive && showControls;

        return (
          <section
            key={ep.number}
            aria-label={`Episode ${ep.number}`}
            className="reel-snap relative overflow-hidden bg-black"
          >
            {/* blurred ambient backdrop (desktop / wide screens) */}
            {drama?.poster && (
              <img
                src={drama.poster}
                alt=""
                aria-hidden="true"
                loading={isNeighbor ? "eager" : "lazy"}
                className="absolute inset-0 h-full w-full scale-110 object-cover opacity-[0.16] blur-3xl"
              />
            )}

            {/* 9:16 stage — full-bleed on phones, framed on desktop */}
            <div
              className="absolute inset-0 flex items-center justify-center"
              onClick={onTap}
            >
              <div
                className={`relative h-full w-full overflow-hidden bg-black transition-shadow duration-500 sm:aspect-[9/16] sm:w-auto sm:rounded-2xl sm:border sm:shadow-lift ${
                  isActive ? "sm:border-gold/25" : "sm:border-line"
                }`}
              >
                {eps && (
                  <video
                    ref={(el) => {
                      if (el) videoRefs.current.set(ep.number, el);
                      else videoRefs.current.delete(ep.number);
                    }}
                    src={eps.url}
                    playsInline
                    preload={isActive ? "auto" : "metadata"}
                    className="absolute inset-0 h-full w-full object-cover"
                    onPlay={() => isActive && patchEp(ep.number, { playing: true, waiting: false })}
                    onPause={() => isActive && patchEp(ep.number, { playing: false })}
                    onWaiting={() => isActive && patchEp(ep.number, { waiting: true })}
                    onPlaying={() =>
                      isActive &&
                      patchEp(ep.number, { waiting: false, playing: true })
                    }
                    onCanPlay={() => isActive && patchEp(ep.number, { waiting: false })}
                    onLoadedMetadata={(e) =>
                      onLoadedMetadata(ep.number, e.currentTarget)
                    }
                    onTimeUpdate={(e) => {
                      if (!isActive) return;
                      patchEp(ep.number, { current: e.currentTarget.currentTime });
                      saveProgress();
                    }}
                    onProgress={(e) => {
                      if (isActive && e.currentTarget.duration > 0)
                        patchEp(ep.number, { duration: e.currentTarget.duration });
                    }}
                    onEnded={() => onEnded(ep.number)}
                    onError={() => {
                      if (!isActive) return;
                      patchEp(ep.number, { waiting: false });
                      setErrorEps((s) => ({ ...s, [ep.number]: true }));
                    }}
                  />
                )}

                {/* loading */}
                {isActive && !hasError && (!eps || isLoading || eSt.waiting) && (
                  <div className="absolute inset-0 grid place-items-center bg-black/50">
                    <div className="flex flex-col items-center gap-4">
                      <span
                        aria-hidden="true"
                        className="h-12 w-12 animate-spin rounded-full border-[3px] border-gold/25 border-t-gold-2"
                      />
                      <span className="text-[11px] font-bold tracking-[0.3em] text-mist uppercase">
                        Memuat episode
                      </span>
                    </div>
                  </div>
                )}

                {/* per-episode error */}
                {isActive && hasError && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/80 px-6 text-center">
                    <span className="grid h-14 w-14 place-items-center rounded-2xl border border-rose/40 bg-rose/10 text-rose">
                      <IconX size={24} />
                    </span>
                    <div>
                      <p className="font-display text-lg text-ivory">
                        Video tidak dapat diputar.
                      </p>
                      <p className="mt-1 text-sm text-mist">
                        Stream episode ini gagal dimuat.
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                      <button
                        type="button"
                        data-ctl
                        onClick={(e) => {
                          e.stopPropagation();
                          setErrorEps((s) => {
                            const n = { ...s };
                            delete n[ep.number];
                            return n;
                          });
                          setRetryTick((t) => t + 1);
                        }}
                        className="btn-gold px-6 py-2.5"
                      >
                        <IconRefresh size={15} />
                        Coba Lagi
                      </button>
                      {drama && (
                        <Link
                          href={`/drama/${drama.vodId}`}
                          data-ctl
                          className="btn-ghost px-5 py-2.5"
                        >
                          <IconFilm size={15} />
                          Episode Lain
                        </Link>
                      )}
                    </div>
                  </div>
                )}

                {/* ended overlay */}
                {isActive && eSt.ended && !hasError && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/70 px-6 text-center">
                    <p className="font-display text-xl text-ivory">
                      Episode selesai
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                      <button
                        type="button"
                        data-ctl
                        onClick={(e) => {
                          e.stopPropagation();
                          const v = videoRefs.current.get(ep.number);
                          if (v) {
                            v.currentTime = 0;
                            patchEp(ep.number, { ended: false });
                            void v.play().catch(() => undefined);
                          }
                        }}
                        className="btn-ghost px-5 py-2.5"
                      >
                        <IconRefresh size={15} />
                        Putar Ulang
                      </button>
                      {i < episodes.length - 1 ? (
                        <button
                          type="button"
                          data-ctl
                          onClick={(e) => {
                            e.stopPropagation();
                            scrollTo(i + 1);
                          }}
                          className="btn-gold px-6 py-2.5"
                        >
                          Episode Berikutnya
                          <IconChevronDown size={15} />
                        </button>
                      ) : drama ? (
                        <Link
                          href={`/drama/${drama.vodId}`}
                          data-ctl
                          className="btn-gold px-6 py-2.5"
                        >
                          <IconFilm size={15} />
                          Pilih Episode
                        </Link>
                      ) : null}
                    </div>
                  </div>
                )}

                {/* first-episode swipe hint */}
                {isActive && i === 0 && eSt.current === 0 && !eSt.playing && !hasError && (
                  <div className="pointer-events-none absolute inset-x-0 bottom-24 flex justify-center">
                    <span className="chip bg-black/60 px-4 py-2 text-xs text-mist">
                      Gulir ke atas untuk episode berikutnya
                      <span
                        aria-hidden="true"
                        className="animate-bounce text-gold-2"
                      >
                        ↑
                      </span>
                    </span>
                  </div>
                )}

                {/* double-tap like burst */}
                {isActive && burst && (
                  <div
                    key={burst.id}
                    className="pointer-events-none absolute inset-0 grid place-items-center"
                  >
                    <span className="animate-pop text-rose drop-shadow-[0_0_24px_rgba(224,92,114,0.6)]">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-20 w-20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M12 21s-7.5-4.7-10-9.3C.4 8.6 2.3 5 5.6 5c2 0 3.4 1.1 4.4 2.6h4c1-1.5 2.4-2.6 4.4-2.6 3.3 0 5.2 3.6 3.6 6.7C19.5 16.3 12 21 12 21Z" />
                      </svg>
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* ---------- UI (top) ---------- */}
            <div
              className={`pointer-events-none absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-black/80 via-black/35 to-transparent px-4 pb-10 transition-opacity duration-300 sm:px-6 ${
                showThisUi ? "opacity-100" : "opacity-0"
              }`}
              style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top))" }}
            >
              <div className="flex items-center gap-3">
                {drama && (
                  <Link
                    href={`/drama/${drama.vodId}`}
                    data-ctl
                    aria-label="Kembali ke halaman drama"
                    onClick={(e) => e.stopPropagation()}
                    className="pointer-events-auto grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-black/40 text-ivory backdrop-blur-md transition-colors hover:border-gold/40 hover:text-gold-2"
                  >
                    <IconChevronLeft size={18} />
                  </Link>
                )}
                <div className="min-w-0">
                  <p className="line-clamp-1 font-display text-[15px] text-ivory sm:text-base">
                    {drama?.title ?? "Drama"}
                  </p>
                  <p className="text-[11px] font-bold tracking-[0.22em] text-gold-2 uppercase">
                    Van Dream
                  </p>
                </div>
                <span className="chip chip-gold ml-auto">
                  EP {ep.number}
                  {episodes.length > 0 ? ` / ${episodes.length}` : ""}
                </span>
              </div>
            </div>

            {/* ---------- UI (bottom) ---------- */}
            <div
              className={`pointer-events-none absolute inset-x-0 bottom-0 z-10 transition-opacity duration-300 ${
                showThisUi ? "opacity-100" : "opacity-0"
              }`}
              style={{ paddingBottom: "max(0.9rem, env(safe-area-inset-bottom))" }}
            >
              <div className="bg-gradient-to-t from-black/85 via-black/40 to-transparent px-4 pt-14 pb-1 sm:px-6">
                {/* seek bar */}
                <input
                  type="range"
                  data-ctl
                  min={0}
                  max={Math.max(Math.floor(eSt.duration), 1)}
                  step={1}
                  value={Math.min(
                    Math.floor(eSt.current),
                    Math.max(Math.floor(eSt.duration), 1),
                  )}
                  onChange={(e) => {
                    const v = videoRefs.current.get(ep.number);
                    if (v) v.currentTime = Number(e.target.value);
                  }}
                  aria-label={`Seek episode ${ep.number}`}
                  onClick={(e) => e.stopPropagation()}
                  className="vd-range pointer-events-auto w-full"
                  style={{
                    background: `linear-gradient(to right, var(--color-gold) ${
                      eSt.duration > 0
                        ? Math.min(100, (eSt.current / eSt.duration) * 100)
                        : 0
                    }%, rgb(255 255 255 / 0.16) 100%)`,
                  }}
                />

                <div className="mt-2.5 flex items-end justify-between gap-4">
                  <div className="min-w-0">
                    <p className="line-clamp-1 text-sm font-semibold text-ivory sm:text-base">
                      {drama?.title ?? "Drama"}
                    </p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2">
                      <span className="chip chip-gold">
                        EP {String(ep.number).padStart(2, "0")}
                        {episodes.length > 0 ? ` / ${episodes.length}` : ""}
                      </span>
                      {drama?.type && (
                        <span className="chip hidden text-mist sm:inline-flex">
                          {drama.type}
                        </span>
                      )}
                      <span className="text-xs font-semibold tabular-nums text-mist">
                        {fmtTime(eSt.current)}
                        <span className="text-faint">
                          {" "}
                          / {fmtTime(eSt.duration)}
                        </span>
                      </span>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      data-ctl
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMute();
                      }}
                      aria-label={muted ? "Bunyikan" : "Bisukan"}
                      className="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-black/40 text-ivory backdrop-blur-md transition-all hover:border-gold/40 hover:text-gold-2 active:scale-95"
                    >
                      {muted || volume === 0 ? (
                        <IconVolumeMute size={19} />
                      ) : (
                        <IconVolume size={19} />
                      )}
                    </button>

                    <button
                      type="button"
                      data-ctl
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFullscreen();
                      }}
                      aria-label={fullscreen ? "Keluar layar penuh" : "Layar penuh"}
                      className="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-black/40 text-ivory backdrop-blur-md transition-all hover:border-gold/40 hover:text-gold-2 active:scale-95"
                    >
                      {fullscreen ? (
                        <IconMinimize size={18} />
                      ) : (
                        <IconMaximize size={18} />
                      )}
                    </button>

                    <button
                      type="button"
                      data-ctl
                      onClick={(e) => {
                        e.stopPropagation();
                        if (i < episodes.length - 1) scrollTo(i + 1);
                      }}
                      disabled={i >= episodes.length - 1}
                      aria-label="Episode berikutnya"
                      className="grid h-11 w-11 place-items-center rounded-full border border-gold/45 bg-gold/15 text-gold-2 backdrop-blur-md transition-all hover:bg-gold/25 active:scale-95 disabled:opacity-35"
                    >
                      <IconChevronDown size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* big play button while paused */}
            {isActive && !eSt.playing && !hasError && !eSt.ended && (
              <button
                type="button"
                data-ctl
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                  bumpUi();
                }}
                aria-label="Putar"
                className="absolute inset-0 z-[5] grid place-items-center"
              >
                <span
                  className="grid place-items-center rounded-full border border-gold/50 bg-black/50 text-gold-2 shadow-gold backdrop-blur-md transition-transform duration-200 hover:scale-105 active:scale-95"
                  style={{ width: "4.5rem", height: "4.5rem" }}
                >
                  <IconPlay size={30} />
                </span>
              </button>
            )}
          </section>
        );
      })}
    </div>
  );
}
