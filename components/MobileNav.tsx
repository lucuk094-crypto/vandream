"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { IconFilm, IconHeart, IconHome, IconSearch } from "./Icons";

const ITEMS: { href: string; label: string; icon: (size: number) => ReactNode; exact?: boolean }[] = [
  { href: "/", label: "Home", icon: (s) => <IconHome size={s} />, exact: true },
  { href: "/drama", label: "Drama", icon: (s) => <IconFilm size={s} /> },
  { href: "/search", label: "Cari", icon: (s) => <IconSearch size={s} /> },
  { href: "/favorites", label: "Favorit", icon: (s) => <IconHeart size={s} /> },
];

/**
 * Frosted bottom navigation (mobile) — gold active state.
 */
export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navigasi bawah"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ink/85 backdrop-blur-xl md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto grid max-w-md grid-cols-4">
        {ITEMS.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`relative flex flex-col items-center gap-1 py-2.5 text-[10px] font-bold tracking-widest uppercase transition-colors duration-200 ${
                active ? "text-gold-2" : "text-faint hover:text-mist"
              }`}
            >
              <span
                aria-hidden="true"
                className={`grid h-7 w-12 place-items-center rounded-full transition-all duration-300 ${
                  active ? "bg-gold/15 shadow-gold" : "bg-transparent"
                }`}
              >
                {item.icon(19)}
              </span>
              {item.label}
              {active && (
                <span
                  aria-hidden="true"
                  className="absolute top-0 h-px w-10 bg-gradient-to-r from-transparent via-gold to-transparent"
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
