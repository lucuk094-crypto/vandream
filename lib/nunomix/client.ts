import "server-only";

import { NunoMixApiError } from "./types";

/**
 * Server-side HTTP client for the NunoMix API.
 *
 * The API token lives exclusively in server environment variables
 * (NUNOMIX_TOKEN) and is attached to every request here. It is never
 * exposed to the browser: this module imports "server-only" so any
 * accidental client-side import fails the build.
 */

const DEFAULT_BASE_URL = "https://nunodrama.my.id/api/nunomix";

let warnedNoToken = false;

function baseUrl(): string {
  const raw = process.env.NUNOMIX_BASE_URL?.trim() ?? "";
  return (raw.length > 0 ? raw : DEFAULT_BASE_URL).replace(/\/+$/, "");
}

function token(): string {
  const raw = process.env.NUNOMIX_TOKEN?.trim() ?? "";
  if (raw.length === 0 && !warnedNoToken) {
    warnedNoToken = true;
    console.warn(
      "[vandream:nunomix] NUNOMIX_TOKEN is not set. Set it in .env.local — all upstream calls will fail.",
    );
  }
  return raw;
}

type QueryValue = string | number | null | undefined;

export interface RequestOptions {
  /** Next.js data-cache revalidation window in seconds. */
  revalidate?: number;
}

function pickErrorPayload(data: unknown): {
  message: string | null;
  code: string | number | null;
} {
  if (typeof data !== "object" || data === null) return { message: null, code: null };
  const obj = data as Record<string, unknown>;
  const candidates = [obj.error, obj.message, obj.msg, obj.detail, obj.info];
  for (const c of candidates) {
    if (typeof c === "string" && c.trim().length > 0) {
      return { message: c.trim(), code: codeValue(obj) };
    }
  }
  return { message: null, code: codeValue(obj) };
}

function codeValue(obj: Record<string, unknown>): string | number | null {
  for (const key of ["code", "status_code", "errno"]) {
    const v = obj[key];
    if (typeof v === "number" || typeof v === "string") return v;
  }
  return null;
}

/**
 * Perform a GET request against the NunoMix API and return the parsed JSON.
 * Throws NunoMixApiError for HTTP errors, envelope-level errors and network failures.
 */
export async function request(
  path: string,
  params: Record<string, QueryValue>,
  opts: RequestOptions = {},
): Promise<unknown> {
  // NOTE: concatenate the base URL with the path — `new URL(absPath, base)`
  // would replace the base's path (/api/nunomix) and break the request.
  const url = new URL(
    `${baseUrl()}${path.startsWith("/") ? path : `/${path}`}`,
  );
  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined) continue;
    url.searchParams.set(key, String(value));
  }
  const t = token();
  if (t.length === 0) {
    throw new NunoMixApiError(
      "NUNOMIX_TOKEN is not configured — set it in .env.local (see README).",
      500,
      "no-token",
    );
  }
  url.searchParams.set("token", t);

  let res: Response;
  try {
    res = await fetch(url.toString(), {
      headers: { accept: "application/json" },
      next: { revalidate: opts.revalidate ?? 300 },
      // Add timeout prevention
      signal: AbortSignal.timeout(30000), // 30 second timeout
    });
  } catch (err) {
    console.error(
      "[vandream:nunomix] network error for",
      path,
      err instanceof Error ? err.message : err,
    );
    throw new NunoMixApiError(
      `Could not reach the upstream drama service${
        err instanceof Error ? `: ${err.message}` : ""
      }`,
      null,
      "network",
    );
  }

  let data: unknown;
  const text = await res.text();
  try {
    data = JSON.parse(text);
  } catch {
    data = null;
  }

  if (!res.ok) {
    const payload = pickErrorPayload(data);
    const message =
      payload.message ?? `Upstream drama service error (HTTP ${res.status})`;
    console.error(
      `[vandream:nunomix] ${path} -> HTTP ${res.status} ${message}`,
    );
    throw new NunoMixApiError(message, res.status, payload.code);
  }

  // Envelope-level error handling.
  // Observed success envelope: { code: 10000, message: "Berhasil", error_msg: "", result: ... }
  const SUCCESS_CODES = new Set([10000, 200, 0, 1]);
  if (typeof data === "object" && data !== null) {
    const obj = data as Record<string, unknown>;
    const code = obj.code;
    const errMsg =
      typeof obj.error_msg === "string" ? obj.error_msg.trim() : "";
    const isEnvelopeError =
      (typeof code === "number" && !SUCCESS_CODES.has(code)) ||
      errMsg.length > 0;
    if (isEnvelopeError) {
      const payload = pickErrorPayload(data);
      const message =
        errMsg.length > 0
          ? errMsg
          : payload.message ?? "Upstream drama service returned an error.";
      console.error(`[vandream:nunomix] ${path} -> envelope error: ${message}`);
      throw new NunoMixApiError(
        message,
        typeof code === "number" ? code : null,
        payload.code,
      );
    }
  }

  return data;
}
