"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import { fetchApi, isAbortError } from "@/lib/api-client";
import type { Drama, PageResult } from "@/lib/nunomix/types";
import { DramaGrid } from "./DramaGrid";
import { EmptyState } from "./EmptyState";
import { ErrorState } from "./ErrorState";
import { SkeletonGrid } from "./Skeleton";
import { IconSearch, IconSparkle, IconX } from "./Icons";

type SearchStatus = "idle" | "loading" | "done" | "error";

/** Real genre words observed in the catalog — one tap = instant search. */
const SUGGESTIONS = [
  "Romansa",
  "Fantasi",
  "Keluarga",
  "Kebangkitan",
  "Misteri",
  "Komedi",
];

/**
 * /search — debounced (500ms) client search against /api/search.
 * The upstream NunoMix API is never called from the browser.
 */
export function SearchPageClient({ initialQ }: { initialQ: string }) {
  const router = useRouter();
  const [q, setQ] = useState(initialQ);
  const [activeQuery, setActiveQuery] = useState(initialQ.trim());
  const [items, setItems] = useState<Drama[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [status, setStatus] = useState<SearchStatus>(
    initialQ.trim() ? "loading" : "idle",
  );
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const seqRef = useRef(0);
  const lastRunRef = useRef(initialQ.trim());

  const runSearch = useCallback(
    async (keyword: string) => {
      const mySeq = ++seqRef.current;
      abortRef.current?.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;
      setStatus("loading");
      setError(null);
      try {
        const data: PageResult<Drama> = await fetchApi(
          `/api/search?q=${encodeURIComponent(keyword)}&page=1`,
          ctrl.signal,
        );
        if (mySeq !== seqRef.current) return;
        setActiveQuery(keyword);
        setItems(data.items);
        setHasMore(data.hasMore);
        setStatus("done");
        router.replace(`/search?q=${encodeURIComponent(keyword)}`, {
          scroll: false,
        });
      } catch (err) {
        if (isAbortError(err) || mySeq !== seqRef.current) return;
        setStatus("error");
        setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
      }
    },
    [router],
  );

  // Debounce: never one request per keystroke. Empty-query reset is
  // handled in the input handler so the effect body only schedules work.
  useEffect(() => {
    const keyword = q.trim();
    if (!keyword) return;
    const t = setTimeout(() => {
      if (lastRunRef.current !== keyword) {
        lastRunRef.current = keyword;
        void runSearch(keyword);
      }
    }, 500);
    return () => clearTimeout(t);
  }, [q, runSearch]);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const resetResults = useCallback(() => {
    ++seqRef.current;
    abortRef.current?.abort();
    lastRunRef.current = "";
    setActiveQuery("");
    setItems([]);
    setHasMore(false);
    setStatus("idle");
    setError(null);
  }, []);

  function onChange(value: string) {
    setQ(value);
    if (value.trim() === "") resetResults();
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const keyword = q.trim();
    if (!keyword) return;
    lastRunRef.current = keyword;
    void runSearch(keyword);
  }

  const showGrid = status === "done" && items.length > 0;
  const showInitialSkeleton = status === "loading" && items.length === 0;

  return (
    <div className="container-vd pt-8 sm:pt-10">
      <header className="mb-8">
        <p className="eyebrow">Katalog</p>
        <h1 className="mt-2 font-display text-4xl tracking-tight text-ivory sm:text-5xl">
          Cari Drama
        </h1>
      </header>

      <form
        role="search"
        onSubmit={onSubmit}
        className="relative mx-auto max-w-2xl"
      >
        <label htmlFor="search-input" className="sr-only">
          Cari drama
        </label>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-5 -translate-y-1/2 text-faint"
        >
          <IconSearch size={18} />
        </span>
        <input
          id="search-input"
          type="search"
          value={q}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Cari judul drama… mis. romansa, fantasi, keluarga"
          autoComplete="off"
          className="h-14 w-full rounded-2xl border border-line-2 bg-surface/80 pr-24 pl-12 text-base font-medium text-ivory shadow-soft backdrop-blur-md transition-all duration-300 placeholder:text-faint focus:border-gold/50 focus:bg-surface focus:shadow-gold focus:outline-none sm:pr-32"
        />
        <div className="absolute top-1/2 right-2.5 flex -translate-y-1/2 items-center gap-2">
          {status === "loading" && (
            <span
              aria-hidden="true"
              className="h-5 w-5 animate-spin rounded-full border-2 border-gold/30 border-t-gold-2"
            />
          )}
          {q && (
            <button
              type="button"
              onClick={() => {
                setQ("");
                resetResults();
              }}
              aria-label="Bersihkan pencarian"
              className="grid h-9 w-9 place-items-center rounded-full border border-line-2 bg-white/[0.05] text-mist transition-colors hover:text-rose"
            >
              <IconX size={14} />
            </button>
          )}
          <button type="submit" className="btn-gold h-10 px-5 text-sm">
            <span className="hidden sm:inline">Cari</span>
            <IconSearch size={14} className="sm:hidden" />
          </button>
        </div>
      </form>

      <div className="mt-8">
        {status === "idle" && (
          <div className="animate-fade">
            <EmptyState
              title="Mau nonton apa malam ini?"
              hint="Ketik judul atau kata kunci di atas — hasilnya muncul otomatis saat kamu mengetik. Atau mulai dari genre:"
              icon={<IconSparkle size={24} />}
            />
            <div className="mx-auto -mt-4 flex max-w-xl flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    setQ(s);
                    lastRunRef.current = s;
                    void runSearch(s);
                  }}
                  className="rounded-full border border-line-2 bg-white/[0.05] px-4 py-2 text-sm font-medium text-mist backdrop-blur-md transition-all duration-200 hover:border-gold/40 hover:text-gold-2 active:scale-95"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {showInitialSkeleton && <SkeletonGrid count={8} />}

        {status === "done" && items.length === 0 && (
          <EmptyState
            title="Drama tidak ditemukan."
            hint={`Tidak ada yang cocok dengan “${activeQuery}”. Coba kata kunci lain atau judul yang lebih pendek.`}
          />
        )}

        {status === "error" && (
          <ErrorState
            title="Pencarian gagal."
            hint={error ?? undefined}
            onRetry={() => {
              const kw = activeQuery || q.trim();
              if (kw) {
                lastRunRef.current = kw;
                void runSearch(kw);
              }
            }}
          />
        )}

        {showGrid && (
          <DramaGrid
            key={activeQuery}
            endpoint="/api/search"
            params={{ q: activeQuery }}
            initialItems={items}
            initialPage={1}
            initialHasMore={hasMore}
            emptyMessage="Drama tidak ditemukan."
          />
        )}
      </div>
    </div>
  );
}
