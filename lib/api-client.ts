import { VanDreamApiError } from "@/lib/nunomix/types";

/**
 * Browser-side fetch helper for Van Dream's own API routes (/api/*).
 * Only ever calls our own backend — it never touches NunoMix directly,
 * so the upstream token can never reach the client bundle.
 */
export class ClientApiError extends VanDreamApiError {}

interface ApiResponseShape {
  error?: string;
}

export async function fetchApi<T>(url: string, signal?: AbortSignal): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, { signal });
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") throw err;
    throw new ClientApiError("Network error. Please check your connection.", 0);
  }

  let json: (T & ApiResponseShape) | null = null;
  try {
    json = (await res.json()) as (T & ApiResponseShape);
  } catch {
    json = null;
  }

  if (!res.ok) {
    const message =
      (json && typeof json.error === "string" && json.error) ||
      "Something went wrong.";
    throw new ClientApiError(message, res.status);
  }

  if (json === null) {
    throw new ClientApiError("Something went wrong.", 500);
  }
  return json;
}

export function isAbortError(err: unknown): boolean {
  return err instanceof DOMException && err.name === "AbortError";
}
