"use client";

import Link from "next/link";
import { removeContinue, useContinueList } from "@/lib/storage";
import { IconPlay, IconX } from "./Icons";
import { PosterImage } from "./PosterImage";
import { SectionHeader } from "./SectionHeader";

/**
 * CONTINUE WATCHING — localStorage-powered row with gold progress bars.
 */
export function ContinueWatching() {
  const entries = useContinueList();

  if (entries.length === 0) return null;

  return (
    <section
      className="container-vd pt-10 sm:pt-12"
      aria-label="Lanjutkan menonton"
    >
      <SectionHeader
        eyebrow="Sambungkan kembali"
        title="Lanjutkan Menonton"
        action={{ href: "/drama", label: "Lihat semua" }}
      />
      <div className="no-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
        {entries.map((e) => {
          const pct =
            e.duration > 0
              ? Math.min(100, Math.round((e.currentPos / e.duration) * 100))
              : 0;
          return (
            <div
              key={e.vodId}
              className="group relative w-36 shrink-0 snap-start sm:w-40"
            >
              <Link
                href={`/watch/${e.vodId}/${e.episode}`}
                className="card-lift block"
                aria-label={`Lanjutkan ${e.title}, episode ${e.episode}`}
              >
                <div className="poster-frame shadow-soft transition-colors duration-300 group-hover:border-gold/35">
                  <PosterImage
                    src={e.poster}
                    alt={`Poster — ${e.title}`}
                    seed={e.vodId}
                    className="transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-2 bg-black/60"
                  >
                    <div
                      className="h-full rounded-r-full bg-gradient-to-r from-gold-3 via-gold to-gold-2"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 grid place-items-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  >
                    <span className="grid h-12 w-12 place-items-center rounded-full border border-gold/50 bg-black/55 text-gold-2 shadow-gold backdrop-blur-md">
                      <IconPlay size={20} />
                    </span>
                  </span>
                </div>
                <p className="mt-2.5 line-clamp-1 px-0.5 text-sm font-semibold text-ivory">
                  {e.title}
                </p>
                <p className="mt-0.5 px-0.5 text-xs font-medium text-faint">
                  EP {e.episode} · {pct}% ditonton
                </p>
              </Link>
              <button
                type="button"
                aria-label={`Hapus ${e.title} dari lanjut menonton`}
                onClick={() => removeContinue(e.vodId)}
                className="absolute top-2 right-2 z-10 grid h-7 w-7 place-items-center rounded-full border border-white/20 bg-black/55 text-mist opacity-0 backdrop-blur-md transition-all duration-200 group-hover:opacity-100 hover:text-rose focus-visible:opacity-100"
              >
                <IconX size={12} />
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
