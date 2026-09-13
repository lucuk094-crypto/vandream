"use client";

import { useState } from "react";

interface PosterImageProps {
  src: string | null;
  alt: string;
  /** Seed for the deterministic fallback tile. */
  seed: string;
  className?: string;
  priority?: boolean;
}

const TILE_HUES = [38, 345, 200, 160, 265, 18];

function hueFor(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return TILE_HUES[h % TILE_HUES.length];
}

function Tile({ alt, seed }: { alt: string; seed: string }) {
  const hue = hueFor(seed);
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 grid place-items-center"
      style={{
        background: `radial-gradient(120% 90% at 50% 0%, hsl(${hue} 45% 16%), #0c0c12 70%)`,
      }}
    >
      <div className="flex flex-col items-center gap-2 px-4 text-center">
        <span
          className="font-display text-4xl text-ivory/85"
          style={{ textShadow: `0 0 24px hsl(${hue} 70% 55% / 0.5)` }}
        >
          {(alt.replace(/^Poster — /, "") || "D").charAt(0).toUpperCase()}
        </span>
        <span className="text-[10px] font-bold tracking-[0.3em] text-ivory/40 uppercase">
          Van Dream
        </span>
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-1/3"
        style={{
          background: `linear-gradient(to top, hsl(${hue} 50% 30% / 0.25), transparent)`,
        }}
      />
    </div>
  );
}

function RemotePoster({
  src,
  alt,
  priority,
  onFail,
}: {
  src: string;
  alt: string;
  priority: boolean;
  onFail: () => void;
}) {
  const [loaded, setLoaded] = useState(false);
  return (
    <>
      {!loaded && (
        <div aria-hidden="true" className="skeleton-shimmer absolute inset-0" />
      )}
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={onFail}
        className={`h-full w-full object-cover transition-opacity duration-500 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </>
  );
}

/**
 * Lazy poster with an elegant dark fallback tile (initial + glow)
 * if the remote image fails or is missing.
 */
export function PosterImage({
  src,
  alt,
  seed,
  className = "",
  priority = false,
}: PosterImageProps) {
  // Only remembers which src failed (set from an event handler — no effects).
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showTile = !src || failedSrc === src;

  return (
    <div className={`relative h-full w-full overflow-hidden bg-surface ${className}`}>
      {showTile ? (
        <Tile alt={alt} seed={seed} />
      ) : (
        <RemotePoster
          key={src}
          src={src}
          alt={alt}
          priority={priority}
          onFail={() => setFailedSrc(src)}
        />
      )}
    </div>
  );
}
