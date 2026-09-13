"use client";

import { addFavorite, removeFavorite, useFavorites } from "@/lib/storage";
import { IconHeart } from "./Icons";

interface FavoriteButtonProps {
  vodId: string;
  title: string;
  poster: string | null;
  /** Pre-joined meta string (type • year) stored denormalized. */
  meta?: string | null;
  size?: "md" | "lg";
}

/**
 * FAVORIT toggle — localStorage, no account, shared external store.
 */
export function FavoriteButton({
  vodId,
  title,
  poster,
  meta = null,
  size = "md",
}: FavoriteButtonProps) {
  const favorites = useFavorites();
  const fav = favorites.some((f) => f.vodId === vodId);
  const sizing = size === "lg" ? "px-6 py-3 text-[15px]" : "px-5 py-2.5 text-sm";

  return (
    <button
      type="button"
      aria-pressed={fav}
      aria-label={fav ? `Hapus ${title} dari favorit` : `Simpan ${title} ke favorit`}
      onClick={() => {
        if (fav) {
          removeFavorite(vodId);
        } else {
          addFavorite({ vodId, title, poster, meta: meta ?? null });
        }
      }}
      className={`btn ${sizing} ${
        fav
          ? "border border-rose/50 bg-rose/15 text-rose hover:bg-rose/25"
          : "btn-ghost"
      }`}
    >
      <IconHeart size={size === "lg" ? 18 : 16} filled={fav} />
      {fav ? "Tersimpan" : "Simpan"}
    </button>
  );
}
