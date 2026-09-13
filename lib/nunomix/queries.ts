import "server-only";

import { request } from "./client";
import {
  normalizeDramaDetail,
  normalizeDramaPage,
  normalizeEpisodeList,
  normalizeStream,
} from "./adapter";
import type { Drama, DramaDetail, Episode, PageResult, StreamResult } from "./types";

/**
 * High-level query functions used by the /api route handlers.
 * Each maps one NunoMix endpoint + one normalizer.
 *
 * Caching policy (Next.js data cache via `next.revalidate`):
 *  - lists & detail: long-lived, cheap to revalidate
 *  - stream: short-lived (URLs may be temporary)
 */

export const CACHE = {
  allDrama: 60, // 1 min (reduced for better responsiveness)
  recommend: 120, // 2 min (reduced for better responsiveness)
  detail: 600, // 10 min (reduced for better responsiveness)
  episodes: 600, // 10 min (reduced for better responsiveness)
  stream: 30, // 30 s
  search: 30, // 30 s (reduced for better responsiveness)
} as const;

export async function getAllDrama(page: number): Promise<PageResult<Drama>> {
  const raw = await request(
    "/all_drama",
    { page, type_id: 0 },
    { revalidate: CACHE.allDrama },
  );
  return normalizeDramaPage(raw, page);
}

export async function getRecommended(page: number): Promise<PageResult<Drama>> {
  const raw = await request(
    "/recommend",
    { page, vod_type: 0 },
    { revalidate: CACHE.recommend },
  );
  return normalizeDramaPage(raw, page);
}

export async function getDramaDetail(vodId: string): Promise<DramaDetail> {
  const raw = await request(
    "/detail",
    { vod_id: vodId },
    { revalidate: CACHE.detail },
  );
  return normalizeDramaDetail(raw);
}

export async function getEpisodes(vodId: string): Promise<Episode[]> {
  const raw = await request(
    "/allepisode",
    { vod_id: vodId },
    { revalidate: CACHE.episodes },
  );
  return normalizeEpisodeList(raw);
}

export async function getStream(
  vodId: string,
  episode: number,
): Promise<StreamResult> {
  const raw = await request(
    "/stream",
    { vod_id: vodId, episode },
    { revalidate: CACHE.stream },
  );
  return normalizeStream(raw);
}

export async function searchDrama(
  keyword: string,
  page: number,
): Promise<PageResult<Drama>> {
  const raw = await request(
    "/search",
    { keyword, page },
    { revalidate: CACHE.search },
  );
  return normalizeDramaPage(raw, page);
}
