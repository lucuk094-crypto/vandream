import type { ReactNode } from "react";
import { Header } from "@/components/Header";
import { MobileNav } from "@/components/MobileNav";
import { Footer } from "@/components/Footer";

/**
 * Site chrome: header, bottom mobile nav and footer.
 * The reels watch experience lives outside this layout so the
 * video can use the full screen with nothing on top of it.
 */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#konten"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[60] focus:rounded-full focus:border focus:border-gold/50 focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-gold-2"
      >
        Lewati ke konten
      </a>
      <Header />
      <main id="konten" className="flex-1">
        {children}
      </main>
      <MobileNav />
      <Footer />
    </div>
  );
}
