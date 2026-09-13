"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Drama } from "@/lib/nunomix/types";
import { IconChevronLeft, IconChevronRight, IconPlay } from "./Icons";

interface HeroCarouselProps {
  dramas: Drama[];
}

const SLIDE_MS = 6500;

/**
 * CINEMATIC HERO CAROUSEL — auto-sliding featured banners.
 * Ken Burns drift on the poster, staggered serif text reveal,
 * auto-advance progress bars, arrows (desktop) & touch swipe (mobile).
 */
export function HeroCarousel({ dramas }: HeroCarouselProps) {
  const n = dramas.length;
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);

  const go = useCallback(
    (i: number) => setIdx(((i % n) + n) % n),
    [n],
  );
  const next = useCallback(() => go(idx + 1), [go, idx]);
  const prev = useCallback(() => go(idx - 1), [go, idx]);

  // Auto-advance (restarts after every slide change so the bar stays in sync).
  useEffect(() => {
    if (paused || n <= 1) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % n), SLIDE_MS);
    return () => clearInterval(t);
  }, [paused, n, idx]);

  // Pause when the tab is hidden (don't burn cycles / skip slides away).
  useEffect(() => {
    const onVis = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  if (n === 0) return null;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Drama unggulan"
      className="relative h-[78dvh] min-h-[540px] max-h-[860px] overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => {
        touchX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (Math.abs(dx) > 48) (dx < 0 ? next : prev)();
      }}
    >
      {dramas.map((d, i) => {
        const active = i === idx;
        return (
          <div
            key={d.vodId}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} dari ${n}: ${d.title}`}
            aria-hidden={!active}
            className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
              active ? "z-10 opacity-100" : "pointer-events-none z-0 opacity-0"
            }`}
          >
            {/* Backdrop with Ken Burns drift */}
            {d.poster && (
              <img
                src={d.poster}
                alt=""
                aria-hidden="true"
                loading={i === 0 ? "eager" : "lazy"}
                fetchPriority={i === 0 ? "high" : undefined}
                className={`absolute inset-0 h-full w-full object-cover object-[68%_12%] ${
                  active ? "kenburns" : ""
                }`}
              />
            )}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/20"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/35 to-transparent"
            />
            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-ink to-transparent"
            />

            {/* Content — mounted only while active so the reveal re-plays */}
            {active && (
              <div className="container-vd absolute inset-x-0 bottom-0 pb-16 sm:pb-20">
                <div className="max-w-2xl">
                  <div className="hero-item flex flex-wrap items-center gap-2" style={{ animationDelay: "60ms" }}>
                    <span className="chip chip-gold">
                      <span
                        aria-hidden="true"
                        className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold-2"
                      />
                      Unggulan Hari Ini
                    </span>
                    {d.type && (
                      <span className="chip text-mist">{d.type}</span>
                    )}
                    {d.remarks && (
                      <span className="chip text-mist">{d.remarks}</span>
                    )}
                  </div>

                  <p
                    className="hero-item mt-5 font-display text-lg text-gold-2/90 italic sm:text-xl"
                    style={{ animationDelay: "140ms" }}
                  >
                    Your Drama. Your Dream.
                  </p>
                  <h1
                    className="hero-item mt-2 font-display text-4xl leading-[1.06] tracking-tight text-ivory sm:text-5xl lg:text-6xl"
                    style={{ animationDelay: "220ms" }}
                  >
                    {d.title}
                  </h1>

                  {d.description && (
                    <p
                      className="hero-item mt-4 line-clamp-2 max-w-xl text-sm leading-relaxed text-mist sm:line-clamp-3 sm:text-base"
                      style={{ animationDelay: "300ms" }}
                    >
                      {d.description}
                    </p>
                  )}

                  <div
                    className="hero-item mt-7 flex flex-wrap items-center gap-3"
                    style={{ animationDelay: "380ms" }}
                  >
                    <Link
                      href={`/watch/${d.vodId}/1`}
                      className="btn-gold px-7 py-3.5 text-[15px]"
                    >
                      <IconPlay size={16} />
                      Tonton Sekarang
                    </Link>
                    <Link
                      href={`/drama/${d.vodId}`}
                      className="btn-ghost px-6 py-3.5 text-[15px]"
                    >
                      Detail Drama
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Slide counter (desktop) */}
      {n > 1 && (
        <div className="absolute top-4 right-4 z-20 hidden sm:block">
          <span className="chip bg-black/50 font-display text-sm tracking-widest">
            {String(idx + 1).padStart(2, "0")}
            <span className="text-faint"> / {String(n).padStart(2, "0")}</span>
          </span>
        </div>
      )}

      {/* Arrows (desktop) */}
      {n > 1 && (
        <div className="absolute top-1/2 right-4 z-20 hidden -translate-y-1/2 flex-col gap-2.5 sm:flex">
          <button
            type="button"
            onClick={prev}
            aria-label="Banner sebelumnya"
            className="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-black/35 text-ivory backdrop-blur-md transition-all hover:border-gold/40 hover:text-gold-2 active:scale-95"
          >
            <IconChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Banner berikutnya"
            className="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-black/35 text-ivory backdrop-blur-md transition-all hover:border-gold/40 hover:text-gold-2 active:scale-95"
          >
            <IconChevronRight size={18} />
          </button>
        </div>
      )}

      {/* Auto-advance indicators */}
      {n > 1 && (
        <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
          {dramas.map((d, i) => (
            <button
              key={d.vodId}
              type="button"
              onClick={() => go(i)}
              aria-label={`Ke banner ${i + 1}: ${d.title}`}
              aria-current={i === idx ? "true" : undefined}
              className="group p-1.5"
            >
              <span className="block h-1 w-7 overflow-hidden rounded-full bg-white/25 transition-all duration-300 group-hover:bg-white/40 sm:w-8">
                {i === idx && (
                  <span
                    key={idx}
                    className={`barfill block h-full rounded-full bg-gradient-to-r from-gold to-gold-2 ${
                      paused ? "barfill-paused" : ""
                    }`}
                    style={{ ["--bar-duration" as string]: `${SLIDE_MS}ms` }}
                  />
                )}
              </span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
