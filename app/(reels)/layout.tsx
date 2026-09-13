import type { ReactNode } from "react";

/**
 * Reels layout — intentionally chrome-free (no header, no bottom nav,
 * no footer) so the video owns the entire screen, TikTok-style.
 */
export default function ReelsLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-dvh bg-black">{children}</main>
  );
}
