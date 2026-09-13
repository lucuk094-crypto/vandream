"use client";

import Link from "next/link";
import { IconChevronLeft, IconX } from "@/components/Icons";

/**
 * Error boundary for the chrome-free reels experience.
 */
export default function ReelsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error("[vandream:reels]", error);
  return (
    <div className="grid min-h-dvh place-items-center bg-black px-6">
      <div className="glass max-w-md px-8 py-12 text-center">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-rose/40 bg-rose/10 text-rose">
          <IconX size={22} />
        </span>
        <h1 className="mt-4 font-display text-xl text-ivory">
          Video tidak dapat diputar.
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-mist">
          Sesuatu terganggu saat memuat pemutar. Coba muat ulang, atau kembali
          ke katalog.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button type="button" onClick={reset} className="btn-gold px-6 py-2.5">
            Muat Ulang
          </button>
          <Link href="/drama" className="btn-ghost px-5 py-2.5">
            <IconChevronLeft size={15} />
            Katalog
          </Link>
        </div>
      </div>
    </div>
  );
}
