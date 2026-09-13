"use client";

import { useSyncExternalStore } from "react";
import type { ContinueEntry, FavoriteEntry } from "@/lib/nunomix/types";

/**
 * Client-side persistence (localStorage only — no sensitive data, no
 * account). Built as tiny external stores consumed via
 * useSyncExternalStore, so components stay in sync without manual
 * effects and never cause hydration mismatches.
 *
 * Every accessor is safe: bad/missing JSON never throws into the UI.
 */

const CONTINUE_KEY = "vandream:continue:v1";
const FAVORITES_KEY = "vandream:favorites:v1";
const MAX_CONTINUE = 24;
const MAX_FAVORITES = 100;

/* --------------------------- core store --------------------------- */

interface StorageStore<T> {
  getSnapshot: () => T;
  getServerSnapshot: () => T;
  subscribe: (listener: () => void) => () => void;
  write: (value: unknown) => void;
}

function createStorageStore<T>(
  key: string,
  serverValue: T,
  parse: (raw: string) => T,
): StorageStore<T> {
  let cachedRaw: string | null | undefined; // undefined = not read yet
  let cachedValue: T | null = null;
  const listeners = new Set<() => void>();

  function emit() {
    for (const listener of [...listeners]) listener();
  }

  const getSnapshot = (): T => {
    if (typeof window === "undefined") return serverValue;
    let raw: string | null;
    try {
      raw = window.localStorage.getItem(key);
    } catch {
      raw = null;
    }
    if (raw === cachedRaw && cachedValue !== null) return cachedValue;
    cachedRaw = raw;
    cachedValue =
      raw === null
        ? serverValue
        : (() => {
            try {
              return parse(raw);
            } catch {
              return serverValue;
            }
          })();
    return cachedValue;
  };

  const subscribe = (listener: () => void): (() => void) => {
    listeners.add(listener);
    // Cross-tab sync (same-tab writes emit manually via write()).
    const onStorage = (e: StorageEvent) => {
      if (e.key === key || e.key === null) emit();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  };

  const write = (value: unknown): void => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage full or unavailable — fail silently.
    }
    emit();
  };

  return { getSnapshot, getServerSnapshot: () => serverValue, subscribe, write };
}

/* --------------------------- continue list --------------------------- */

const EMPTY_CONTINUE: ContinueEntry[] = [];
const EMPTY_FAVORITES: FavoriteEntry[] = [];

function parseContinue(raw: string): ContinueEntry[] {
  const list: unknown = JSON.parse(raw);
  if (!Array.isArray(list)) return EMPTY_CONTINUE;
  return (list as ContinueEntry[])
    .filter(
      (e): e is ContinueEntry =>
        typeof e === "object" &&
        e !== null &&
        typeof e.vodId === "string" &&
        typeof e.episode === "number" &&
        typeof e.currentPos === "number" &&
        typeof e.duration === "number",
    )
    .sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0));
}

const continueStore = createStorageStore<ContinueEntry[]>(
  CONTINUE_KEY,
  EMPTY_CONTINUE,
  parseContinue,
);

/* --------------------------- favorites --------------------------- */

function parseFavorites(raw: string): FavoriteEntry[] {
  const list: unknown = JSON.parse(raw);
  if (!Array.isArray(list)) return EMPTY_FAVORITES;
  return (list as FavoriteEntry[])
    .filter(
      (f): f is FavoriteEntry =>
        typeof f === "object" &&
        f !== null &&
        typeof f.vodId === "string" &&
        typeof f.title === "string",
    )
    .sort((a, b) => (b.addedAt ?? 0) - (a.addedAt ?? 0));
}

const favoritesStore = createStorageStore<FavoriteEntry[]>(
  FAVORITES_KEY,
  EMPTY_FAVORITES,
  parseFavorites,
);

/* --------------------------- hooks --------------------------- */

export function useContinueList(): ContinueEntry[] {
  return useSyncExternalStore(
    continueStore.subscribe,
    continueStore.getSnapshot,
    continueStore.getServerSnapshot,
  );
}

export function useFavorites(): FavoriteEntry[] {
  return useSyncExternalStore(
    favoritesStore.subscribe,
    favoritesStore.getSnapshot,
    favoritesStore.getServerSnapshot,
  );
}

/* --------------------------- actions --------------------------- */

export function saveContinue(entry: ContinueEntry): void {
  const next = continueStore
    .getSnapshot()
    .filter((e) => e.vodId !== entry.vodId);
  next.push(entry);
  next.sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0));
  continueStore.write(next.slice(0, MAX_CONTINUE));
}

export function removeContinue(vodId: string): void {
  continueStore.write(
    continueStore.getSnapshot().filter((e) => e.vodId !== vodId),
  );
}

export function addFavorite(entry: Omit<FavoriteEntry, "addedAt">): void {
  const next = favoritesStore
    .getSnapshot()
    .filter((f) => f.vodId !== entry.vodId);
  next.unshift({ ...entry, addedAt: Date.now() });
  favoritesStore.write(next.slice(0, MAX_FAVORITES));
}

export function removeFavorite(vodId: string): void {
  favoritesStore.write(
    favoritesStore.getSnapshot().filter((f) => f.vodId !== vodId),
  );
}
