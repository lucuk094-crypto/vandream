import Link from "next/link";
import { IconPlay } from "@/components/Icons";

export default function NotFound() {
  return (
    <div className="container-vd flex min-h-[70dvh] flex-col items-center justify-center py-20 text-center">
      <p
        aria-hidden="true"
        className="bg-gradient-to-b from-gold-2 via-gold to-gold-3/40 bg-clip-text font-display text-8xl text-transparent sm:text-9xl"
      >
        404
      </p>
      <h1 className="mt-4 font-display text-2xl text-ivory sm:text-3xl">
        Tersesat di dalam mimpi
      </h1>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-mist">
        Halaman yang kamu cari tidak ada — mungkin dramanya sudah dipindah,
        atau link-nya salah ketik.
      </p>
      <Link href="/" className="btn-gold mt-8 px-7 py-3">
        <IconPlay size={15} />
        Kembali ke Beranda
      </Link>
    </div>
  );
}
