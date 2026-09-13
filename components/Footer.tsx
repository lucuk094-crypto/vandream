import Link from "next/link";
import { Logo } from "./Logo";

const GENRES = [
  "Romansa",
  "Fantasi",
  "Keluarga",
  "Kebangkitan",
  "Drama Kolosal",
  "Misteri",
  "Balas Dendam",
];

/**
 * Footer — carries the brand story ("Tentang Van Dream") so visitors
 * always know what this site is.
 */
export function Footer() {
  return (
    <footer className="mt-14 border-t border-line bg-ink-2/60 pb-24 md:pb-0">
      <div className="container-vd grid gap-10 py-12 md:grid-cols-[1.4fr_1fr]">
        <div>
          <Logo withTagline />
          <h2 className="eyebrow mt-6">Tentang Van Dream</h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-mist">
            <span className="font-display text-base text-ivory italic">
              Van Dream
            </span>{" "}
            adalah platform streaming drama modern dengan pengalaman menonton
            ala <span className="text-gold-2">reels</span> — gulir ke atas,
            episode berikutnya langsung lanjut. Ribuan drama romansa, fantasi,
            dan keluarga tersaji dalam kualitas penuh, gratis, tanpa akun, dan
            nyaman ditonton di ponsel maupun desktop.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {GENRES.map((g) => (
              <Link
                key={g}
                href={`/search?q=${encodeURIComponent(g)}`}
                className="rounded-full border border-line bg-white/[0.04] px-3 py-1 text-xs font-medium text-mist transition-colors hover:border-gold/40 hover:text-gold-2"
              >
                {g}
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 text-sm">
          <div>
            <h3 className="eyebrow">Jelajah</h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link href="/" className="text-mist transition-colors hover:text-gold-2">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/drama" className="text-mist transition-colors hover:text-gold-2">
                  Semua Drama
                </Link>
              </li>
              <li>
                <Link href="/tentang" className="text-mist transition-colors hover:text-gold-2">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-mist transition-colors hover:text-gold-2">
                  Cari
                </Link>
              </li>
              <li>
                <Link href="/favorites" className="text-mist transition-colors hover:text-gold-2">
                  Favoritku
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="eyebrow">Mengapa Van Dream</h3>
            <ul className="mt-4 space-y-2.5 text-mist">
              <li>Mode reels sinematik</li>
              <li>Gratis &amp; tanpa login</li>
              <li>Lanjut nonton di mana saja</li>
              <li>Optimalkan untuk ponsel</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-vd flex flex-col items-center justify-between gap-2 py-5 text-xs text-faint sm:flex-row">
          <p>© {new Date().getFullYear()} Van Dream. Your Drama. Your Dream.</p>
          <p className="font-medium tracking-wide">
            Konten disediakan oleh mitra resmi — nonton secara legal.
          </p>
        </div>
      </div>
    </footer>
  );
}
