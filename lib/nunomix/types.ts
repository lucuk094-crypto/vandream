/**
 * Normalized domain types for Van Dream.
 *
 * The frontend NEVER consumes the raw NunoMix JSON. Every payload is
 * normalized through lib/nunomix/adapter.ts into these shapes, so if the
 * upstream API changes, only the adapter needs to be fixed.
 */

/** A drama item as used in cards, hero, lists. */
export interface Drama {
  vodId: string;
  title: string;
  poster: string | null;
  description: string | null;
  year: string | null;
  /** Drama category, e.g. "Chinese Drama". */
  type: string | null;
  /** Score/rating string as provided by the API (no formatting added). */
  score: string | null;
  /** Short update note, e.g. "Updated EP 12 / 24" — verbatim from API. */
  remarks: string | null;
  /** e.g. "Completed" / "Ongoing" when the API provides it. */
  status: string | null;
  /** Derived only when the API provides a "new" flag. */
  isNew: boolean;
}

/** Full detail for the drama page. */
export interface DramaDetail extends Drama {
  cast: string[];
  director: string[];
  genres: string[];
  totalEpisodes: number | null;
  /**
   * Episodes embedded in the detail payload (upstream `vod_collection`).
   * Used as a fallback when the dedicated episode endpoint fails.
   */
  embeddedEpisodes: Episode[];
}

/** One episode in the episode list. */
export interface Episode {
  number: number;
  title: string | null;
  /** Direct episode URL when the API provides one. */
  url: string | null;
}

export type StreamType = "mp4" | "m3u8" | "other";

/** Normalized stream result. */
export interface StreamResult {
  url: string;
  type: StreamType;
}

/** Paginated list envelope returned by our own API routes. */
export interface PageResult<T> {
  items: T[];
  page: number;
  hasMore: boolean;
  total: number | null;
}

/** Entry stored in localStorage for the Continue Watching feature. */
export interface ContinueEntry {
  vodId: string;
  episode: number;
  /** 0..1 playback progress. */
  progress: number;
  /** Playback position in seconds. */
  currentPos: number;
  /** Total duration in seconds. */
  duration: number;
  title: string;
  poster: string | null;
  updatedAt: number;
}

/** Entry stored in localStorage for Favorites. */
export interface FavoriteEntry {
  vodId: string;
  title: string;
  poster: string | null;
  /** Denormalized meta so the favorites page renders without API calls. */
  meta: string | null;
  addedAt: number;
}

/** Error thrown by the NunoMix client/adapter layer. */
export class NunoMixApiError extends Error {
  readonly status: number | null;
  readonly code: string | number | null;

  constructor(
    message: string,
    status: number | null = null,
    code: string | number | null = null,
  ) {
    super(message);
    this.name = "NunoMixApiError";
    this.status = status;
    this.code = code;
  }
}

/** Error thrown by the browser-side API client. */
export class VanDreamApiError extends Error {
  readonly status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "VanDreamApiError";
    this.status = status;
  }
}
