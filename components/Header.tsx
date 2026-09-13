"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Logo } from "./Logo";
import { IconSearch } from "./Icons";

const NAV = [
  { href: "/", label: "Home", exact: true },
  { href: "/drama", label: "Drama" },
  { href: "/tentang", label: "Tentang" },
  { href: "/favorites", label: "Favorit" },
];

/**
 * Glassy, minimal top bar — the quiet frame of a premium streaming site.
 */
export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [q, setQ] = useState("");

  function onSearch(e: FormEvent) {
    e.preventDefault();
    const keyword = q.trim();
    if (!keyword) return;
    router.push(`/search?q=${encodeURIComponent(keyword)}`);
    setQ("");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink/75 backdrop-blur-xl">
      <div className="container-vd flex h-16 items-center gap-4">
        <Logo />

        <nav
          aria-label="Navigasi utama"
          className="ml-6 hidden items-center gap-1 md:flex"
        >
          {NAV.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
                  active
                    ? "bg-gold/12 text-gold-2"
                    : "text-mist hover:bg-white/[0.06] hover:text-ivory"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <form
            role="search"
            onSubmit={onSearch}
            className="hidden items-center overflow-hidden rounded-full border border-line-2 bg-white/[0.05] transition-all duration-300 focus-within:border-gold/50 focus-within:bg-white/[0.08] focus-within:shadow-gold sm:flex"
          >
            <label htmlFor="header-search" className="sr-only">
              Cari drama
            </label>
            <input
              id="header-search"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari drama…"
              autoComplete="off"
              className="h-10 w-40 bg-transparent px-4 text-sm font-medium text-ivory placeholder:text-faint focus:outline-none md:w-56"
            />
            <button
              type="submit"
              aria-label="Cari"
              className="grid h-10 w-11 place-items-center text-gold transition-colors hover:text-gold-2"
            >
              <IconSearch size={16} />
            </button>
          </form>

          <Link
            href="/search"
            aria-label="Cari drama"
            className="grid h-10 w-10 place-items-center rounded-full border border-line-2 bg-white/[0.05] text-mist transition-colors hover:border-gold/40 hover:text-gold-2 sm:hidden"
          >
            <IconSearch size={17} />
          </Link>
        </div>
      </div>
    </header>
  );
}
