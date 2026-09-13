import type { Metadata, Viewport } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "Van Dream — Streaming Drama Premium",
    template: "%s · Van Dream",
  },
  description:
    "Van Dream — nonton drama premium tanpa login. Ribuan episode drama romansa, fantasi, dan keluarga dalam mode reels: gulir, lanjut, nikmati.",
  keywords: [
    "drama",
    "nonton drama",
    "streaming drama",
    "drama pendek",
    "reels drama",
    "short drama",
  ],
  openGraph: {
    type: "website",
    siteName: "Van Dream",
    title: "Van Dream — Streaming Drama Premium",
    description:
      "Your Drama. Your Dream. Nonton drama premium dalam mode reels — gulir dan lanjut tanpa putus.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${manrope.variable} ${playfair.variable}`}>
      <body className="min-h-dvh">
        {children}
      </body>
    </html>
  );
}
