import Link from "next/link";
import type { Metadata } from "next";
import { DramaGrid } from "@/components/DramaGrid";
import { ErrorState } from "@/components/ErrorState";
import { ContinueWatching } from "@/components/ContinueWatching";
import { HeroCarousel } from "@/components/HeroCarousel";
import { PosterImage } from "@/components/PosterImage";
import { RetryButton } from "@/components/RetryButton";
import { SectionHeader } from "@/components/SectionHeader";
import { getAllDrama, getRecommended } from "@/lib/nunomix/queries";
import type { Drama } from "@/lib/nunomix/types";

export const metadata: Metadata = {
  title: "Streaming Drama Premium",
  description:
    "Nonton drama premium dalam mode reels — gulir ke atas, episode berikutnya langsung lanjut. Gratis, tanpa login.",
};

/** Ranked poster card for the "Recommended" row (serif rank number). */
function RankedCard({ drama, rank }: { drama: Drama; rank: number }) {
  return (
    <li className="shrink-0 snap-start">
      <Link
        href={`/drama/${drama.vodId}`}
        className="group flex items-end gap-2"
        aria-label={`#${rank} ${drama.title}`}
      >
        <span
          aria-hidden="true"
          className="bg-gradient-to-b from-gold-2 via-gold to-transparent bg-clip-text font-display text-6xl leading-[0.8] text-transparent sm:text-7xl"
        >
          {rank}
        </span>
        <div className="card-lift w-36 sm:w-40">
          <div className="poster-frame shadow-soft transition-colors duration-300 group-hover:border-gold/35">
            <PosterImage
              src={drama.poster}
              alt={`Poster — ${drama.title}`}
              seed={drama.vodId}
              className="transition-transform duration-700 ease-out group-hover:scale-[1.06]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/80 via-black/25 to-transparent"
            />
            {drama.remarks && (
              <span className="chip absolute right-2 bottom-2">{drama.remarks}</span>
            )}
          </div>
          <p className="mt-2.5 line-clamp-1 px-0.5 text-sm font-semibold text-ivory transition-colors group-hover:text-gold-2">
            {drama.title}
          </p>
        </div>
      </Link>
    </li>
  );
}

export default async function HomePage() {
  const [recSettled, allSettled] = await Promise.allSettled([
    getRecommended(1),
    getAllDrama(1),
  ]);
  
  if (recSettled.status === "rejected")
    console.error("[vandream:page] recommend failed", recSettled.reason);
  if (allSettled.status === "rejected")
    console.error("[vandream:page] all_drama failed", allSettled.reason);

  const rec = recSettled.status === "fulfilled" ? recSettled.value : null;
  const allFulfilled =
    allSettled.status === "fulfilled" ? allSettled.value : null;

  // Featured carousel: top of recommendations, fallback to the catalog.
  const pool: Drama[] = rec?.items ?? allFulfilled?.items ?? [];
  const seen = new Set<string>();
  const featured = pool
    .filter((d) => (seen.has(d.vodId) ? false : (seen.add(d.vodId), true)))
    .slice(0, 5);

  const ranked = pool
    .filter((d) => d.vodId !== featured[0]?.vodId)
    .slice(0, 14);

  return (
    <>
      {/* HERO — auto-sliding featured carousel */}
      {featured.length > 0 ? (
        <HeroCarousel dramas={featured} />
      ) : (
        <div className="container-vd pt-10">
          <ErrorState
            hint="Kami belum bisa memuat drama unggulan hari ini."
            action={<RetryButton />}
          />
        </div>
      )}

      <ContinueWatching />

      {/* RECOMMENDED — ranked horizontal row */}
      <section
        className="container-vd pt-10 animate-fade-up sm:pt-12"
        style={{ animationDelay: "80ms" }}
        aria-label="Rekomendasi"
      >
        <SectionHeader
          eyebrow="Dipilih untukmu"
          title="Rekomendasi"
          action={{ href: "/drama", label: "Semua drama" }}
        />
        {recSettled.status === "fulfilled" && ranked.length > 0 ? (
          <ol className="no-scrollbar -mx-4 flex snap-x gap-6 overflow-x-auto px-4 pb-2 sm:mx-0 sm:gap-7 sm:px-0">
            {ranked.map((d, i) => (
              <RankedCard key={d.vodId} drama={d} rank={i + 1} />
            ))}
          </ol>
        ) : recSettled.status === "rejected" ? (
          <ErrorState
            compact
            title="Rekomendasi tidak tersedia"
            action={<RetryButton />}
          />
        ) : null}
      </section>

      {/* ALL DRAMA */}
      <section
        className="container-vd pt-10 animate-fade-up sm:pt-12"
        style={{ animationDelay: "160ms" }}
        aria-label="Semua drama"
      >
        <SectionHeader
          eyebrow="Katalog lengkap"
          title="Semua Drama"
          action={{ href: "/drama", label: "Jelajahi" }}
        />
        {allFulfilled ? (
          <DramaGrid
            endpoint="/api/drama"
            initialItems={allFulfilled.items}
            initialPage={1}
            initialHasMore={allFulfilled.hasMore}
            emptyAction={{ href: "/drama", label: "Jelajahi katalog" }}
          />
        ) : (
          <ErrorState title="Katalog tidak tersedia" action={<RetryButton />} />
        )}
      </section>
    </>
  );
}
