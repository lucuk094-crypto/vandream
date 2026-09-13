import "server-only";

import { NextResponse } from "next/server";
import { NunoMixApiError } from "@/lib/nunomix/types";

/**
 * Map an internal error to a safe, user-friendly API response.
 * Raw upstream details are logged server-side only — the browser
 * never sees raw API payloads.
 */
export function toApiError(err: unknown): NextResponse {
  if (err instanceof NunoMixApiError) {
    console.error(
      "[vandream:api] upstream error:",
      err.message,
      { status: err.status, code: err.code },
    );
    if (err.status === 404) {
      return NextResponse.json({ error: "Drama not found." }, { status: 404 });
    }
    if (err.status === 400) {
      return NextResponse.json({ error: "Invalid request." }, { status: 502 });
    }
    if (err.status === 401 || err.status === 403) {
      return NextResponse.json(
        { error: "The drama service is temporarily unavailable." },
        { status: 502 },
      );
    }
    return NextResponse.json(
      { error: "Something went wrong while fetching drama data." },
      { status: 502 },
    );
  }

  console.error("[vandream:api] unexpected error:", err);
  return NextResponse.json(
    { error: "Something went wrong." },
    { status: 500 },
  );
}
