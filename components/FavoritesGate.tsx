"use client";

import dynamic from "next/dynamic";
import { FavoritesFallback } from "./FavoritesFallback";

/**
 * Client gate: loads the favorites UI without SSR so the real
 * localStorage list appears without an empty-state flash or
 * hydration mismatch.
 */
const FavoritesClient = dynamic(() => import("./FavoritesClient"), {
  ssr: false,
  loading: () => <FavoritesFallback />,
});

export function FavoritesGate() {
  return <FavoritesClient />;
}
