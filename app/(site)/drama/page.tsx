import type { Metadata } from "next";
import { DramaGrid } from "@/components/DramaGrid";
import { ErrorState } from "@/components/ErrorState";
import { RetryButton } from "@/components/RetryButton";
import { getAllDrama } from "@/lib/nunomix/queries";

export const metadata: Metadata = {
  title: "Semua Drama",
  description:
    "Jelajahi katalog lengkap Van Dream — romansa, fantasi, keluarga, dan lebihnya lagi.",
};

export default async function BrowseDramaPage() {
  let initial: Awaited<ReturnType<typeof getAllDrama>> | null = null;
  try {
    initial = await getAllDrama(1);
  } catch (err) {
    console.error("[vandream:page] /drama initial load failed", err);
  }

  return (
    <div className="container-vd pt-8 sm:pt-10">
      <header className="mb-8">
        <p className="eyebrow">Katalog lengkap</p>
        <h1 className="mt-2 font-display text-4xl tracking-tight text-ivory sm:text-5xl">
          Semua Drama
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-mist sm:text-base">
          Gulir untuk memuat otomatis, atau gunakan tombol di bawah. Setiap
          poster menyimpan ribuan episode cerita.
        </p>
      </header>

      {initial ? (
        <DramaGrid
          endpoint="/api/drama"
          initialItems={initial.items}
          initialPage={1}
          initialHasMore={initial.hasMore}
        />
      ) : (
        <ErrorState
          hint="Katalog drama belum bisa dimuat saat ini."
          action={<RetryButton />}
        />
      )}
    </div>
  );
}
