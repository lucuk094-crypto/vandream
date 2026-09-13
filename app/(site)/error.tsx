"use client";

import { ErrorState } from "@/components/ErrorState";

/**
 * Client-side error boundary for the site routes — no raw error text,
 * just a calm panel with a recovery action.
 */
export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error("[vandream:client]", error);
  return (
    <div className="container-vd py-16">
      <ErrorState
        title="Terjadi kesalahan tak terduga"
        hint="Halaman ini gagal dimuat. Muat ulang — kalau masih bermasalah, coba akses beranda dulu."
        action={
          <button
            type="button"
            onClick={reset}
            className="btn-gold px-6 py-2.5"
          >
            Muat Ulang Halaman
          </button>
        }
      />
    </div>
  );
}
