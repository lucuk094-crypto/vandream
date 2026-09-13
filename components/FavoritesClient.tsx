"use client";

import Link from "next/link";
import type { FavoriteEntry } from "@/lib/nunomix/types";
import { removeFavorite, useFavorites } from "@/lib/storage";
import { EmptyState } from "./EmptyState";
import { PosterImage } from "./PosterImage";
import { IconHeart, IconX } from "./Icons";

/**
 * FAVORITKUKU — localStorage, no account, shared external store.
 */
export function FavoritesClient() {
  const favs: FavoriteEntry[] = useFavorites();
  return <FavoritesGrid favs={favs} />;
}

export default FavoritesClient;

function FavoritesGrid({ favs }: { favs: FavoriteEntry[] }) {
  return (
    <div className="container-vd pt-8 sm:pt-10">
      <header className="mb-8">
        <p className="eyebrow">Koleksimu</p>
        <h1 className="mt-2 font-display text-4xl tracking-tight text-ivory sm:text-5xl">
          Favoritku
        </h1>
        <p className="mt-3 text-sm text-mist">
          Tersimpan di perangkat ini — tanpa akun, tanpa ribet.
        </p>
      </header>

      {favs.length === 0 ? (
        <EmptyState
          title="Belum ada favorit."
          hint="Tekan tombol SIMPAN di halaman drama mana pun untuk mengumpulkannya di sini."
          icon={<IconHeart size={24} />}
          action={
            <Link href="/drama" className="btn-gold px-6 py-3">
              Jelajahi Drama
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {favs.map((f) => (
            <div key={f.vodId} className="group relative">
              <Link
                href={`/drama/${f.vodId}`}
                className="card-lift block"
                aria-label={f.title}
              >
                <div className="poster-frame shadow-soft transition-colors duration-300 group-hover:border-gold/35">
                  <PosterImage
                    src={f.poster}
                    alt={`Poster — ${f.title}`}
                    seed={f.vodId}
                    className="transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                  />
                  <span className="chip chip-rose absolute top-2 left-2">
                    <IconHeart size={10} filled />
                  </span>
                </div>
                <h3 className="mt-2.5 line-clamp-1 px-0.5 text-sm font-semibold text-ivory">
                  {f.title}
                </h3>
                {f.meta && (
                  <p className="mt-0.5 px-0.5 text-xs font-medium text-faint">
                    {f.meta}
                  </p>
                )}
              </Link>
              <button
                type="button"
                aria-label={`Hapus ${f.title} dari favorit`}
                onClick={() => removeFavorite(f.vodId)}
                className="absolute top-2 right-2 z-10 grid h-7 w-7 place-items-center rounded-full border border-white/20 bg-black/55 text-mist opacity-0 backdrop-blur-md transition-all duration-200 group-hover:opacity-100 hover:text-rose focus-visible:opacity-100"
              >
                <IconX size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
