"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { fetchApi, isAbortError } from "@/lib/api-client";
import type { Drama, PageResult } from "@/lib/nunomix/types";
import { DramaCard } from "./DramaCard";
import { EmptyState } from "./EmptyState";
import { ErrorState } from "./ErrorState";
import { SkeletonCardCell } from "./Skeleton";

interface DramaGridProps {
  /** Our own API endpoint, e.g. "/api/drama" or "/api/search". */
  endpoint: string;
  /** Extra query params, e.g. { q: "romance" } for search. */
  params?: Record<string, string>;
  initialItems?: Drama[];
  initialPage?: number;
  initialHasMore?: boolean;
  emptyMessage?: string;
  emptyHint?: string;
  emptyAction?: { href: string; label: string };
}

function dedupe(items: Drama[]): Drama[] {
  const seen = new Set<string>();
  const out: Drama[] = [];
  for (const item of items) {
    if (seen.has(item.vodId)) continue;
    seen.add(item.vodId);
    out.push(item);
  }
  return out;
}

/**
 * Responsive grid + infinite scroll (IntersectionObserver) with a
 * graceful "Muat lagi" button fallback.
 */
export function DramaGrid({
  endpoint,
  params,
  initialItems = [],
  initialPage = 1,
  initialHasMore = initialItems.length > 0,
  emptyMessage = "Drama tidak ditemukan.",
  emptyHint,
  emptyAction,
}: DramaGridProps) {
  const paramsKey = useMemo(() => JSON.stringify(params ?? {}), [params]);

  const [items, setItems] = useState<Drama[]>(() => dedupe(initialItems));
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const busyRef = useRef(false);

  const loadMore = useCallback(async () => {
    if (busyRef.current || !hasMore) return;
    busyRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const qs = new URLSearchParams({ page: String(page + 1) });
      for (const [k, v] of Object.entries(
        JSON.parse(paramsKey) as Record<string, string>,
      )) {
        qs.set(k, v);
      }
      const data: PageResult<Drama> = await fetchApi(
        `${endpoint}?${qs.toString()}`,
      );
      setItems((prev) => dedupe([...prev, ...data.items]));
      setPage(data.page);
      setHasMore(data.hasMore);
    } catch (err) {
      if (!isAbortError(err)) {
        setError(
          err instanceof Error && err.message
            ? err.message
            : "Terjadi kesalahan.",
        );
      }
    } finally {
      busyRef.current = false;
      setLoading(false);
    }
  }, [endpoint, page, hasMore, paramsKey]);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore || typeof IntersectionObserver === "undefined")
      return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) void loadMore();
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasMore, loadMore]);

  const showInitialSkeleton = items.length === 0 && loading && !error;
  const isEmpty = items.length === 0 && !loading && !error;

  return (
    <div>
      {isEmpty && (
        <EmptyState
          title={emptyMessage}
          hint={emptyHint}
          action={
            emptyAction ? (
              <Link href={emptyAction.href} className="btn-gold px-6 py-3">
                {emptyAction.label}
              </Link>
            ) : undefined
          }
        />
      )}

      {showInitialSkeleton ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <SkeletonCardCell key={i} />
          ))}
        </div>
      ) : (
        <>
          {items.length > 0 && (
            <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
              {items.map((d) => (
                <DramaCard key={d.vodId} drama={d} />
              ))}
              {loading &&
                Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCardCell key={`sk-${i}`} />
                ))}
            </div>
          )}

          {error && (
            <div className="mt-6">
              <ErrorState
                compact
                title="Gagal memuat lebih banyak"
                hint={error}
                onRetry={() => void loadMore()}
              />
            </div>
          )}

          {!error && hasMore && (
            <>
              <div ref={sentinelRef} aria-hidden="true" className="h-px" />
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={() => void loadMore()}
                  disabled={loading}
                  className="btn-ghost px-8 py-3"
                >
                  {loading ? (
                    <>
                      <span
                        aria-hidden="true"
                        className="h-4 w-4 animate-spin rounded-full border-2 border-gold/40 border-t-gold-2"
                      />
                      Memuat…
                    </>
                  ) : (
                    "Muat Lagi"
                  )}
                </button>
              </div>
            </>
          )}

          {!error && !hasMore && items.length > 0 && (
            <p className="mt-10 flex items-center justify-center gap-3 text-xs font-semibold tracking-[0.25em] text-faint uppercase">
              <span aria-hidden="true" className="h-px w-10 bg-line-2" />
              Sudah sampai di ujung
              <span aria-hidden="true" className="h-px w-10 bg-line-2" />
            </p>
          )}
        </>
      )}
    </div>
  );
}
