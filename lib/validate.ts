/**
 * Input validation helpers.
 * Never trust user-supplied URL parameters — validate every value
 * before it is forwarded to the upstream NunoMix API.
 */

/** Parse a positive integer page number. Returns null when invalid. */
export function parsePage(
  value: string | null,
  opts: { max?: number } = {},
): number | null {
  if (value === null || value.trim() === "") return 1;
  const n = Number(value);
  if (!Number.isInteger(n) || n < 1 || n > (opts.max ?? 500)) return null;
  return n;
}

/** Validate a drama vod id (numeric, 1–12 digits). Returns null when invalid. */
export function parseVodId(value: string | null | undefined): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!/^\d{1,12}$/.test(trimmed)) return null;
  return trimmed;
}

/** Validate an episode number (integer 1–100000). Returns null when invalid. */
export function parseEpisode(
  value: string | null | undefined,
): number | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!/^\d{1,6}$/.test(trimmed)) return null;
  const n = Number(trimmed);
  if (!Number.isInteger(n) || n < 1 || n > 100000) return null;
  return n;
}

/** Validate a search keyword. Returns null when invalid or empty. */
export function parseKeyword(value: string | null | undefined): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim().slice(0, 80);
  if (trimmed.length === 0) return null;
  if (/[\u0000-\u001f\u007f]/.test(trimmed)) return null;
  return trimmed;
}
