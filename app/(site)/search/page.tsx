import type { Metadata } from "next";
import { SearchPageClient } from "@/components/SearchPageClient";

export const metadata: Metadata = {
  title: "Search Drama",
  description: "Search the Van Dream drama catalog.",
};

export default async function SearchPage({
  searchParams,
}: PageProps<"/search">) {
  const { q } = await searchParams;
  return <SearchPageClient initialQ={typeof q === "string" ? q : ""} />;
}
