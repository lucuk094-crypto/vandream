import type { Metadata } from "next";
import { FavoritesGate } from "@/components/FavoritesGate";

export const metadata: Metadata = {
  title: "My Favorites",
  description: "Your favorite dramas, saved on this device.",
};

export default function FavoritesPage() {
  return <FavoritesGate />;
}
