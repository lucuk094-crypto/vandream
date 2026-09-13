import Link from "next/link";
import type { Metadata } from "next";
import {
  IconChevronDown,
  IconClock,
  IconFilm,
  IconPlay,
  IconSearch,
  IconSparkle,
  IconStar,
} from "@/components/Icons";

export const metadata: Metadata = {
  title: "Tentang Van Dream",
  description:
    "Kenali Van Dream — platform streaming drama dengan mode reels: gulir, lanjut, nikmati. Gratis, tanpa login, dan dirancang untuk ponsel.",
};

const FEATURES = [
  {
    icon: <IconChevronDown size={22} />,
    title: "Mode Reels Sinematik",
    desc: "Satu episode mengisi satu layar penuh. Gulir ke atas, episode berikutnya langsung lanjut — pengalaman seperti TikTok, namun untuk drama premium.",
  },
  {
    icon: <IconSparkle size={22} />,
    title: "Gratis & Tanpa Login",
    desc: "Tidak ada akun, tidak ada langganan, tidak ada biaya tersembunyi. Buka, pilih drama, tonton.",
  },
  {
    icon: <IconClock size={22} />,
    title: "Lanjut Nonton Otomatis",
    desc: "Progres tersimpan di perangkatmu setiap beberapa detik. Tutup aplikasi, buka lagi besok — posisimu masih ada di tempat yang sama.",
  },
  {
    icon: <IconFilm size={22} />,
    title: "Dirancang untuk Ponsel",
    desc: "Mobile-portrait first: grid 2 kolom, navigasi bawah, dan player 9:16 yang nyaman digenggam dengan satu tangan.",
  },
  {
    icon: <IconSearch size={22} />,
    title: "Katalog yang Hidup",
    desc: "Drama, episode, dan rekomendasi dimuat langsung dari sumber konten — katalog terus bertambah dan diperbarui.",
  },
  {
    icon: <IconStar size={22} />,
    title: "Kualitas & Kenyamanan",
    desc: "Video HD vertikal, kontrol lengkap (seek, volume, fullscreen, keyboard), skeleton loader, dan fallback poster yang rapi.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Pilih Dramamu",
    desc: "Jelajahi banner unggulan, baris rekomendasi ber-rank, atau cari langsung dari ribuan judul di katalog.",
    href: "/drama",
    cta: "Jelajahi",
  },
  {
    n: "02",
    title: "Tonton dalam Mode Reels",
    desc: "Tekan TONTON — satu episode satu layar. Gulir ke atas untuk episode berikutnya; video berjalan tanpa terputus.",
    href: "#",
    cta: "Contoh: detail drama",
  },
  {
    n: "03",
    title: "Simpan & Lanjut Kapan Saja",
    desc: "Favoritkan drama dan biarkan tombol SIMPAN bekerja; baris Lanjutkan Menonton selalu tahu sampai di mana kamu berhenti.",
    href: "/favorites",
    cta: "Lihat Favorit",
  },
];

const STATS = [
  { value: "Ribuan", label: "Drama di katalog" },
  { value: "41+", label: "Episode per drama" },
  { value: "9:16", label: "Video HD vertikal" },
  { value: "0", label: "Biaya & akun" },
];

/**
 * TENTANG VAN DREAM — the full story page: what it is, why it's
 * different, how it works, and an honest numbers strip.
 */
export default function AboutPage() {
  return (
    <div className="overflow-hidden">
      {/* ---------- header ---------- */}
      <header className="relative overflow-hidden border-b border-line">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-1/2 h-96 w-[46rem] -translate-x-1/2 rounded-full bg-gold/10 blur-3xl"
        />
        <p
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 -bottom-14 font-display text-[11rem] leading-none text-white/[0.025] italic select-none sm:text-[16rem]"
        >
          Van
        </p>

        <div className="container-vd relative py-16 sm:py-24">
          <div className="max-w-3xl animate-fade-up">
            <p className="eyebrow">Tentang Kami</p>
            <h1 className="mt-3 font-display text-4xl leading-[1.05] tracking-tight text-ivory sm:text-6xl">
              Tentang{" "}
              <span className="bg-gradient-to-b from-gold-2 to-gold bg-clip-text text-transparent italic">
                Van Dream
              </span>
            </h1>
            <p className="mt-4 font-display text-lg text-gold-2/90 italic sm:text-xl">
              Your Drama. Your Dream.
            </p>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-mist sm:text-lg">
              Van Dream adalah platform streaming drama modern yang kami
              bangun dengan satu keyakinan:{" "}
              <span className="font-semibold text-ivory">
                menonton drama seharusnya sesederhana menggeser layar.
              </span>{" "}
              Kami memadukan katalog drama yang luas dengan player mode{" "}
              <span className="text-gold-2">reels</span> — satu episode satu
              layar, gulir ke atas, dan cerita berjalan terus tanpa jeda.
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-mist sm:text-base">
              Tidak ada akun untuk dibuat, tidak ada bayaran yang dibuntel, dan
              tidak ada langkah ekstra. Semua tersimpan otomatis di perangkatmu
              — favoritmu, progresmu, dan dramamu berikutnya sudah menunggu
              setiap kali kamu kembali.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/drama" className="btn-gold px-7 py-3.5 text-[15px]">
                <IconPlay size={16} />
                Mulai Menonton
              </Link>
              <a href="#cara-kerja" className="btn-ghost px-6 py-3.5 text-[15px]">
                Cara Kerja
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* ---------- features ---------- */}
      <section className="container-vd py-14 sm:py-20" aria-label="Keunggulan">
        <div className="mb-10 max-w-2xl">
          <p className="eyebrow">Kenapa Van Dream</p>
          <h2 className="mt-2 font-display text-3xl tracking-tight text-ivory sm:text-4xl">
            Dibangun untuk kenyamanan menonton
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-mist sm:text-base">
            Setiap detail — dari warna hingga gerakan — dipilih agar mata
            nyaman dan cerita selalu jadi pusat perhatian.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <article
              key={f.title}
              className="glass group p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold/30 hover:shadow-gold"
            >
              <span className="grid h-12 w-12 place-items-center rounded-2xl border border-gold/30 bg-gold/10 text-gold-2 transition-transform duration-300 group-hover:scale-110">
                {f.icon}
              </span>
              <h3 className="mt-5 font-display text-xl text-ivory">{f.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-mist">{f.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ---------- how it works ---------- */}
      <section
        id="cara-kerja"
        className="border-y border-line bg-ink-2/50 py-14 sm:py-20"
        aria-label="Cara kerja"
      >
        <div className="container-vd">
          <div className="mb-10 max-w-2xl">
            <p className="eyebrow">Cara Kerja</p>
            <h2 className="mt-2 font-display text-3xl tracking-tight text-ivory sm:text-4xl">
              Tiga langkah, langsung ke cerita
            </h2>
          </div>

          <ol className="grid gap-5 md:grid-cols-3">
            {STEPS.map((s) => (
              <li key={s.n} className="glass relative overflow-hidden p-6 sm:p-7">
                <span
                  aria-hidden="true"
                  className="bg-gradient-to-b from-gold/60 to-transparent bg-clip-text font-display text-6xl text-transparent"
                >
                  {s.n}
                </span>
                <h3 className="mt-4 font-display text-xl text-ivory">{s.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-mist">{s.desc}</p>
                <Link
                  href={s.href}
                  className="mt-4 inline-flex items-center gap-1 text-xs font-bold tracking-[0.18em] text-gold uppercase transition-colors hover:text-gold-2"
                >
                  {s.cta}
                  <IconChevronDown size={12} className="rotate-90" />
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- stats ---------- */}
      <section className="container-vd py-14 sm:py-20" aria-label="Statistik">
        <div className="glass grid grid-cols-2 gap-px overflow-hidden md:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="bg-ink/40 px-6 py-8 text-center sm:py-10">
              <p className="font-display text-3xl text-gold-2 sm:text-4xl">
                {s.value}
              </p>
              <p className="mt-2 text-xs font-semibold tracking-[0.18em] text-faint uppercase">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="container-vd pb-20">
        <div className="relative overflow-hidden rounded-3xl border border-gold/25 bg-gradient-to-b from-surface-2 to-ink px-6 py-14 text-center sm:px-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-20 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-gold/15 blur-3xl"
          />
          <p className="eyebrow relative">Siap menonton?</p>
          <h2 className="relative mt-3 font-display text-3xl leading-tight text-ivory sm:text-5xl">
            Mimpi malammu dimulai dari satu guliran
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-sm leading-relaxed text-mist sm:text-base">
            Buka dramamu favorit, biarkan mode reels membawa kamu dari episode
            ke episode — sampai kamu lupa waktu.
          </p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/drama" className="btn-gold px-8 py-3.5 text-[15px]">
              <IconPlay size={16} />
              Jelajahi Drama
            </Link>
            <Link href="/search" className="btn-ghost px-7 py-3.5 text-[15px]">
              <IconSearch size={16} />
              Cari Judul
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
