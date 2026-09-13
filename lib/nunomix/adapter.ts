import "server-only";

import {
  NunoMixApiError,
  type Drama,
  type DramaDetail,
  type Episode,
  type PageResult,
  type StreamResult,
  type StreamType,
} from "./types";

/**
 * Normalization layer ("adapter") between the raw NunoMix JSON and the
 * normalized domain types.
 *
 * IMPORTANT: field names below are validated against the REAL API
 * responses (see README → "API inspection"). If the upstream structure
 * changes, ONLY this file needs to change.
 */

type Obj = Record<string, unknown>;

function isObj(v: unknown): v is Obj {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** First non-empty string among candidate keys. */
function firstString(obj: Obj, keys: string[]): string | null {
  for (const k of keys) {
    const v = obj[k];
    if (typeof v === "string" && v.trim().length > 0) return v.trim();
    if (typeof v === "number" && Number.isFinite(v)) return String(v);
  }
  return null;
}

/** First finite number among candidate keys. */
function firstNumber(obj: Obj, keys: string[]): number | null {
  for (const k of keys) {
    const v = obj[k];
    if (typeof v === "number" && Number.isFinite(v)) return v;
    if (typeof v === "string" && v.trim() !== "" && Number.isFinite(Number(v))) {
      return Number(v);
    }
  }
  return null;
}

/** Normalize a raw array-or-string list (cast, director, genres). */
function listFrom(obj: Obj, keys: string[]): string[] {
  for (const k of keys) {
    const v = obj[k];
    if (Array.isArray(v)) {
      return v
        .map((x) => (typeof x === "string" ? x.trim() : ""))
        .filter((x) => x.length > 0);
    }
    if (typeof v === "string" && v.trim().length > 0) {
      return v
        .split(/[|,，、/]+/)
        .map((x) => x.trim())
        .filter((x) => x.length > 0);
    }
  }
  return [];
}

/** Safe poster URL extraction — must look like an absolute http(s) URL. */
function safeUrl(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const trimmed = v.trim();
  if (!/^https?:\/\/[^\s]+$/i.test(trimmed)) return null;
  return trimmed;
}

/* ------------------------------------------------------------------ */
/* Drama item                                                          */
/* ------------------------------------------------------------------ */

function normalizeDrama(raw: unknown): Drama | null {
  if (!isObj(raw)) return null;

  const vodId = firstString(raw, ["id", "vod_id", "vodId", "drama_id"]);
  if (!vodId) return null;

  const title = firstString(raw, [
    "vod_name",
    "name",
    "title",
    "vod_title",
    "vod_name_en",
  ]);
  if (!title) return null;

  const isNewRaw = raw.is_new ?? raw.isNew ?? raw.isnew ?? raw.hot;
  const isNew =
    isNewRaw === true ||
    isNewRaw === 1 ||
    isNewRaw === "1" ||
    isNewRaw === "true";

  // Score — the API uses vod_douban_score; 0 means "no score".
  const score = firstNumber(raw, [
    "vod_douban_score",
    "vod_score",
    "score",
    "rating",
  ]);

  // "EP 61" / "EP 12/24" — derived from the API's own serial/total counters
  // (the raw `remarks` field is empty in list responses).
  const serial = firstNumber(raw, ["vod_serial", "serial"]);
  const total = firstNumber(raw, ["vod_total", "total_episodes", "vod_episodes"]);
  const remarks =
    serial && serial > 0
      ? total && total > serial
        ? `EP ${serial}/${total}`
        : `EP ${serial}`
      : firstString(raw, ["remarks", "vod_remarks", "update_info", "updated", "vod_progress"]);

  return {
    vodId,
    title,
    poster: safeUrl(
      firstString(raw, ["vod_pic", "pic", "cover", "poster", "image", "vod_pic_2"]),
    ),
    description: firstString(raw, [
      "vod_blurb",
      "vod_content",
      "content",
      "description",
      "desc",
      "vod_desc",
      "intro",
      "summary",
    ]),
    year: firstString(raw, ["vod_year", "year", "release_year"]),
    type: firstString(raw, [
      "topic_name",
      "type_name",
      "type",
      "category",
      "vod_type_name",
    ]),
    score: score && score > 0 ? String(score) : null,
    remarks,
    status: firstString(raw, ["vod_status", "status", "state"]),
    isNew,
  };
}

/* ------------------------------------------------------------------ */
/* Lists / pagination                                                  */
/* ------------------------------------------------------------------ */

/**
 * Unwrap the list envelope. Handles: raw array, { list }, { data: [...] },
 * { data: { list } }, { items }, { results }.
 */
function unwrapList(raw: unknown): {
  items: unknown[];
  total: number | null;
  pageCount: number | null;
} {
  if (Array.isArray(raw)) {
    return { items: raw, total: null, pageCount: null };
  }
  if (isObj(raw)) {
    const dataObj = isObj(raw.data) ? raw.data : undefined;
    const resultObj = isObj(raw.result) ? raw.result : undefined;
    const candidates: unknown[] = [
      raw.result,
      resultObj?.vod_list, // /recommend nests the list under result.vod_list
      raw.vod_list,
      raw.list,
      raw.items,
      raw.results,
      raw.data,
      dataObj?.list,
      dataObj?.items,
      dataObj?.results,
      dataObj?.drama,
    ];
    for (const c of candidates) {
      if (Array.isArray(c)) {
        const total = firstTotal(raw);
        const pageCount =
          firstNumber(raw, ["pagecount", "page_count"]) ??
          (isObj(raw.pagination)
            ? firstNumber(raw.pagination as Obj, ["pagecount", "total_page", "totalPage"])
            : null);
        return { items: c, total, pageCount };
      }
    }
    // Some APIs return { code, data: [ ... ] } where data is the list itself —
    // covered above; fall through to empty.
    return { items: [], total: firstTotal(raw), pageCount: null };
  }
  return { items: [], total: null, pageCount: null };
}

function firstTotal(obj: Obj): number | null {
  const t =
    firstNumber(obj, ["total", "total_count", "totalCount", "count", "totalnum"]) ??
    (isObj(obj.pagination)
      ? firstNumber(obj.pagination as Obj, ["total", "total_count", "count"])
      : null);
  return t;
}

/**
 * Normalize a paginated drama list response.
 * pageSize drives the `hasMore` fallback when the API doesn't report
 * totals. Observed upstream page sizes vary between ~12 and ~20, so the
 * threshold is kept below that to avoid stopping early; a null/empty
 * `result` (end of catalog) yields hasMore=false.
 */
export function normalizeDramaPage(
  raw: unknown,
  page: number,
  pageSize = 10,
): PageResult<Drama> {
  const { items, total, pageCount } = unwrapList(raw);
  const dramas: Drama[] = [];
  for (const item of items) {
    const d = normalizeDrama(item);
    if (d) dramas.push(d);
  }

  let hasMore: boolean;
  if (total !== null && total > 0) {
    hasMore = page * pageSize < total;
  } else if (pageCount !== null && pageCount > 0) {
    hasMore = page < pageCount;
  } else {
    hasMore = dramas.length >= pageSize;
  }

  if (page === 1 && items.length > 0 && dramas.length === 0) {
    throw new NunoMixApiError(
      "Upstream drama list response has an unexpected shape.",
      502,
      "malformed",
    );
  }

  return { items: dramas, page, hasMore, total };
}

/* ------------------------------------------------------------------ */
/* Detail                                                              */
/* ------------------------------------------------------------------ */

export function normalizeDramaDetail(raw: unknown): DramaDetail {
  let obj: Obj | null = null;
  if (isObj(raw)) {
    // Envelope shapes seen in the wild:
    //   { code: 10000, message: "Berhasil", error_msg: "", result: {...} }
    //   { code: 10000, ..., result: [ {...} ] }
    //   { data: {...} } or the bare object
    const result = raw.result;
    if (isObj(result)) obj = result;
    else if (Array.isArray(result) && isObj(result[0])) obj = result[0];
    else if (isObj(raw.data)) obj = isObj(raw.data.result) ? raw.data.result : raw.data;
    else obj = raw;
  }
  if (!obj) {
    throw new NunoMixApiError("Drama detail response is empty.", 502, "malformed");
  }

  // Detail payloads sometimes nest the drama under vod_info / info.
  for (const key of ["vod_info", "info", "detail"]) {
    if (isObj(obj[key]) && obj[key] !== obj) {
      const merged: Obj = { ...obj, ...obj[key] };
      obj = merged;
      break;
    }
  }

  const base = normalizeDrama(obj);
  if (!base) {
    throw new NunoMixApiError("Drama detail response has an unexpected shape.", 502, "malformed");
  }

  return {
    ...base,
    cast: listFrom(obj, ["vod_actor", "actor", "actors", "cast"]),
    director: listFrom(obj, ["vod_director", "director"]),
    genres: listFrom(obj, [
      "theme",
      "vod_class",
      "class",
      "genre",
      "genres",
      "vod_tag",
      "tags",
    ]),
    totalEpisodes: firstNumber(obj, [
      "vod_total",
      "total_episodes",
      "totalEpisodes",
      "vod_episodes",
      "episode_count",
      "episodes_count",
      "vod_totals",
    ]),
    embeddedEpisodes: episodesFromCollection(obj),
  };
}

/* ------------------------------------------------------------------ */
/* Episodes                                                            */
/* ------------------------------------------------------------------ */

/**
 * Some episodes are titled in Chinese, e.g. "第1集" ("Episode 1").
 * That duplicates the EP number and needs CJK glyphs the UI font
 * doesn't ship — drop it and let the number speak for itself.
 */
function cleanEpisodeTitle(title: string | null): string | null {
  if (!title) return null;
  // Exact "Episode N" in Chinese, e.g. "第1集" — redundant with the EP
  // number and needs CJK glyphs the UI font doesn't ship.
  if (/^\s*第\s*\d+\s*集\s*$/.test(title)) return null;
  return title;
}

export function normalizeEpisodeList(raw: unknown): Episode[] {
  const { items } = unwrapList(raw);
  const episodes: Episode[] = [];
  const seen = new Set<number>();

  for (const item of items) {
    if (!isObj(item)) continue;

    // Number candidates: explicit fields first.
    let number = firstNumber(item, [
      "episode",
      "episode_no",
      "episodeNo",
      "sort",
      "index",
      "seq",
      "ep",
      "order",
      "no",
    ]);

    // Fallback: parse "EP 5", "Episode 12", "5" from a name/title field.
    if (number === null) {
      const name = firstString(item, [
        "name",
        "title",
        "ep_name",
        "episode_name",
        "remark",
        "note",
      ]);
      if (name) {
        const m = name.match(/(\d{1,4})/);
        if (m) number = Number(m[1]);
      }
    }
    if (number === null || number < 1) continue;

    const title = cleanEpisodeTitle(
      firstString(item, ["title", "name", "ep_name", "episode_name", "note"]),
    );
    // Prefer the https proxy URL (play_url): video_url/direct_url point at
    // plain-HTTP IPs which browsers block on https pages (mixed content).
    const url = safeUrl(
      firstString(item, [
        "play_url",
        "url",
        "stream_url",
        "raw_video_url",
        "video_url",
        "direct_url",
        "link",
        "src",
        "file",
      ]),
    );

    if (seen.has(number)) continue;
    seen.add(number);
    episodes.push({ number, title: title && title !== String(number) ? title : null, url });
  }

  episodes.sort((a, b) => a.number - b.number);
  return episodes;
}

/**
 * Fallback episode source: the /detail payload embeds a `vod_collection`
 * array (per-episode thumbnails + direct CDN mp4 URLs). Used when the
 * /allepisode endpoint is unavailable.
 */
export function episodesFromCollection(raw: unknown): Episode[] {
  let arr: unknown = raw;
  if (isObj(raw)) arr = raw.vod_collection ?? raw.collection ?? raw.result;
  if (!Array.isArray(arr)) return [];

  const episodes: Episode[] = [];
  const seen = new Set<number>();
  for (const item of arr) {
    if (!isObj(item)) continue;
    const number = firstNumber(item, [
      "collection_order",
      "collection",
      "episode",
      "sort",
      "index",
    ]);
    if (number === null || number < 1 || seen.has(number)) continue;
    seen.add(number);
    const title = cleanEpisodeTitle(firstString(item, ["title", "name"]));
    const url = safeUrl(
      firstString(item, [
        "m3u8_url",
        "raw_video_url",
        "video_url",
        "play_url",
        "url",
      ]),
    );
    episodes.push({ number, title, url });
  }
  episodes.sort((a, b) => a.number - b.number);
  return episodes;
}

/* ------------------------------------------------------------------ */
/* Stream                                                              */
/* ------------------------------------------------------------------ */

function detectStreamType(url: string): StreamType {
  const clean = url.split("?")[0].toLowerCase();
  if (clean.endsWith(".m3u8")) return "m3u8";
  if (/\.(mp4|webm|ogv)$/.test(clean)) return "mp4";
  return "other";
}

export function normalizeStream(raw: unknown): StreamResult {
  let candidate: string | null = null;

  const searchIn = (obj: Obj | null): void => {
    if (candidate || !obj) return;
    for (const key of [
      "result",
      "url",
      "play_url",
      "stream_url",
      "stream",
      "src",
      "link",
      "file",
      "video_url",
      "playurl",
      "uri",
    ]) {
      const v = obj[key];
      if (typeof v === "string" && /^https?:\/\/[^\s]+$/i.test(v.trim())) {
        candidate = v.trim();
        return;
      }
      // Some APIs return { list: [{ url }] } / { result: [...] }
      if (Array.isArray(v)) {
        for (const el of v) {
          if (typeof el === "string" && /^https?:\/\/[^\s]+$/i.test(el.trim())) {
            candidate = el.trim();
            return;
          }
          if (isObj(el)) searchIn(el);
          if (candidate) return;
        }
      } else if (isObj(v)) {
        searchIn(v);
      }
    }
  };

  if (typeof raw === "string" && /^https?:\/\/[^\s]+$/i.test(raw.trim())) {
    candidate = raw.trim();
  } else if (isObj(raw)) {
    searchIn(raw);
    if (!candidate && isObj(raw.data)) searchIn(raw.data);
  }

  if (!candidate) {
    throw new NunoMixApiError(
      "Stream response does not contain a video URL.",
      502,
      "no-stream",
    );
  }

  // The API tells us the container directly ({ format: "mp4" | "m3u8",
  // sometimes nested under data) — trust it over URL sniffing, because
  // proxied URLs carry the real file extension only inside the query.
  const declared = isObj(raw)
    ? firstString(raw, ["format", "type", "video_type"]) ??
      (isObj(raw.data) ? firstString(raw.data, ["format", "type", "video_type"]) : null)
    : null;
  const type: StreamType =
    declared === "m3u8" ? "m3u8" : declared === "mp4" ? "mp4" : detectStreamType(candidate);

  return { url: candidate, type };
}
