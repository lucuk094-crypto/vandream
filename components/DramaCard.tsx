import Link from "next/link";
import type { Drama } from "@/lib/nunomix/types";
import { IconStar } from "./Icons";
import { PosterImage } from "./PosterImage";

interface DramaCardProps {
  drama: Drama;
}

/**
 * Premium poster card: soft frame, glass chips, hover lift + gold ring.
 */
export function DramaCard({ drama }: DramaCardProps) {
  const meta = [drama.type, drama.year].filter(Boolean).join(" · ");

  return (
    <Link
      href={`/drama/${drama.vodId}`}
      className="card-lift group block"
      aria-label={drama.title}
    >
      <div className="poster-frame shadow-soft transition-colors duration-300 group-hover:border-gold/35">
        <PosterImage
          src={drama.poster}
          alt={`Poster — ${drama.title}`}
          seed={drama.vodId}
          className="transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />

        {/* bottom veil for chip legibility */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/80 via-black/25 to-transparent"
        />

        {/* top chips */}
        <div className="absolute top-2 left-2 flex flex-col items-start gap-1.5">
          {drama.isNew && (
            <span className="chip chip-gold">
              <span className="h-1 w-1 rounded-full bg-gold-2" />
              Baru
            </span>
          )}
          {drama.score && (
            <span className="chip">
              <IconStar size={10} className="text-gold-2" />
              <span className="text-gold-2">{drama.score}</span>
            </span>
          )}
        </div>
        {drama.remarks && (
          <span className="chip absolute right-2 bottom-2">
            {drama.remarks}
          </span>
        )}
      </div>

      <div className="mt-2.5 px-0.5">
        <h3 className="line-clamp-1 text-sm font-semibold text-ivory transition-colors duration-200 group-hover:text-gold-2">
          {drama.title}
        </h3>
        {meta && <p className="mt-0.5 text-xs font-medium text-faint">{meta}</p>}
      </div>
    </Link>
  );
}
