"use client";

import Link from "next/link";
import { useState } from "react";
import type { Episode } from "@/lib/nunomix/types";
import { IconChevronDown, IconPlay } from "./Icons";

interface EpisodeListProps {
  vodId: string;
  episodes: Episode[];
  /** Currently selected episode (highlighted). */
  active?: number;
}

const CHUNK = 12;

/**
 * Refined episode selector: numbered glass tiles, gold active state.
 * Chunked to keep long series snappy.
 */
export function EpisodeList({ vodId, episodes, active }: EpisodeListProps) {
  const [visible, setVisible] = useState(CHUNK);

  if (episodes.length === 0) {
    return (
      <p className="rounded-xl border border-line bg-surface/50 px-4 py-6 text-center text-sm font-medium text-mist">
        Daftar episode tidak tersedia untuk drama ini.
      </p>
    );
  }

  const shown = episodes.slice(0, visible);

  return (
    <div>
      <ol className="grid grid-cols-4 gap-2 sm:grid-cols-6 sm:gap-2.5 md:grid-cols-8">
        {shown.map((ep) => {
          const isActive = active === ep.number;
          return (
            <li key={ep.number}>
              <Link
                href={`/watch/${vodId}/${ep.number}`}
                aria-current={isActive ? "true" : undefined}
                aria-label={
                  ep.title ? `Episode ${ep.number}: ${ep.title}` : `Episode ${ep.number}`
                }
                className={`group relative flex aspect-square flex-col items-center justify-center gap-0.5 rounded-xl border transition-all duration-200 ${
                  isActive
                    ? "border-gold/60 bg-gradient-to-b from-gold/25 to-gold/10 text-gold-2 shadow-gold"
                    : "border-line bg-white/[0.04] text-mist hover:border-gold/35 hover:bg-white/[0.08] hover:text-ivory"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`font-display text-lg transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? "text-gold-2" : ""
                  }`}
                >
                  {ep.number}
                </span>
                {ep.title ? (
                  <span className="line-clamp-1 max-w-[90%] text-[10px] font-medium opacity-70">
                    {ep.title}
                  </span>
                ) : (
                  isActive && (
                    <span className="text-[10px] font-bold tracking-widest uppercase opacity-80">
                      Sedang
                    </span>
                  )
                )}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute top-1.5 right-1.5 grid h-5 w-5 place-items-center rounded-full bg-gold text-[#221604]"
                  >
                    <IconPlay size={10} />
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ol>

      {visible < episodes.length && (
        <div className="mt-5 flex justify-center">
          <button
            type="button"
            onClick={() => setVisible((v) => v + 12)}
            className="btn-ghost px-6 py-2.5 text-[13px]"
          >
            Tampilkan episode lainnya ({episodes.length - visible})
            <IconChevronDown size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
