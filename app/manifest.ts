import type { MetadataRoute } from "next";

/**
 * Web app manifest — lets mobile users add Van Dream to their home
 * screen with the right colors and identity.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Van Dream — Streaming Drama Premium",
    short_name: "Van Dream",
    description:
      "Nonton drama premium dalam mode reels — gulir ke atas, episode berikutnya langsung lanjut. Gratis, tanpa login.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0f",
    theme_color: "#0a0a0f",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
