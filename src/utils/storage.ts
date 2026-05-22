export const STORAGE_KEYS = {
  exerciseStates: 'iupac-cheminfo:exercise-state:v1',
  lastExercise: 'iupac-cheminfo:active-exercise:v1',
  playgroundState: 'iupac-cheminfo:playground:v1',
} as const;

/**
 * Read a JSON-encoded value from `localStorage`. Returns `null` when the
 * entry is missing, malformed or `localStorage` is unavailable (SSR, quota
 * errors, disabled storage). Never throws.
 * @param key - The storage key to read.
 * @returns The decoded value, or `null` when unavailable.
 */
export function readJson(key: string): unknown {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Write a JSON-encoded value to `localStorage`. Silently ignores quota
 * errors and missing `window` — exercise state is best-effort.
 * @param key - The storage key to write.
 * @param value - The value to serialise.
 */
export function writeJson(key: string, value: unknown): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Best-effort: ignore quota and serialisation errors.
  }
}

/**
 * Read a raw string from `localStorage`. Returns `null` when missing or
 * `localStorage` is unavailable. Never throws.
 * @param key - The storage key to read.
 * @returns The stored string, or `null`.
 */
export function readString(key: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

/**
 * Write a raw string to `localStorage`. Silently ignores quota errors.
 * @param key - The storage key to write.
 * @param value - The string to store.
 */
export function writeString(key: string, value: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Best-effort.
  }
}
