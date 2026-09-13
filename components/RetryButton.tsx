"use client";

import { useRouter } from "next/navigation";
import { IconRefresh } from "./Icons";

/** Re-fetches server data via Next.js router refresh. */
export function RetryButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => router.refresh()}
      className="btn-gold px-6 py-2.5"
    >
      <IconRefresh size={15} />
      Muat Ulang
    </button>
  );
}
