import { XSadd } from 'ml-xsadd';

import type { FunctionalKey } from '../data/molecules.ts';
import type { Exercise, ExerciseKind, ExerciseLevel } from '../types.ts';
import { STORAGE_KEYS, readJson, writeJson } from '../utils/storage.ts';

import { EXERCISES, findExercise } from './exercises.ts';

/**
 * Describes a custom exercise series — what a teacher hands out via a URL.
 * Either an explicit list of exercise ids (`ids`) or a filter set + seed
 * for a deterministic random pick.
 */
export interface SeriesSpec {
  /**
   * Display name shown to the student. Optional; falls back to a generic
   * "Custom series" label when omitted.
   */
  title?: string;
  /**
   * Explicit list of exercise ids. When set, takes precedence over the
   * filter fields below.
   */
  ids?: string[];
  /** Numeric seed used to shuffle and pick from the filtered pool. */
  seed?: number;
  /** Limit on the number of exercises drawn from the filtered pool. */
  count?: number;
  /** Restrict to exercises of a given kind. */
  kinds?: ExerciseKind[];
  /** Restrict to exercises at a given pedagogic level. */
  levels?: ExerciseLevel[];
  /**
   * Require every selected exercise to carry at least one of these tags.
   * Empty array disables the filter.
   */
  tags?: FunctionalKey[];
  /**
   * When `true`, the seed in `seed` is ignored and each student gets a
   * fresh random seed the first time they open the link. The assigned
   * seed is persisted in `localStorage` keyed by the URL token, so the
   * same student keeps the same exercises across visits.
   * @default false
   */
  randomizeSeed?: boolean;
}

/** Persisted record of a series the student has opened at least once. */
export interface StoredSeriesAssignment {
  /** Effective seed used to shuffle — either the teacher's or per-student. */
  seed: number;
  /** Teacher-supplied title, if any (kept for a future "saved series" UI). */
  title?: string;
  /** Whether the seed was assigned per-student (vs. fixed by the teacher). */
  perStudent: boolean;
  /** Epoch ms when the student first opened this series on this device. */
  savedAt: number;
}

type SeriesAssignmentMap = Record<string, StoredSeriesAssignment>;

/**
 * Return the persisted seed for `token`, creating one when needed. When
 * `spec.randomizeSeed` is true a fresh random seed is generated on first
 * open; otherwise the teacher's deterministic seed is recorded as-is.
 * Subsequent calls return the previously assigned value so the student
 * sees the exact same exercise list on every revisit.
 * @param token - The opaque `?series=` URL token.
 * @param spec - The decoded series spec.
 * @returns The seed to use when resolving the series.
 */
export function getOrAssignStudentSeed(
  token: string,
  spec: SeriesSpec,
): number {
  const map = (readJson(STORAGE_KEYS.seriesAssignments) ??
    {}) as SeriesAssignmentMap;
  const existing = map[token];
  if (existing) return existing.seed;
  const seed = spec.randomizeSeed
    ? Math.floor(Math.random() * 1_000_000)
    : (spec.seed ?? 0);
  map[token] = {
    seed,
    title: spec.title,
    perStudent: Boolean(spec.randomizeSeed),
    savedAt: Date.now(),
  };
  writeJson(STORAGE_KEYS.seriesAssignments, map);
  return seed;
}

/**
 * Materialise the {@link SeriesSpec} as an ordered, deduplicated list of
 * concrete exercises. Unknown ids are silently dropped; seeded shuffles
 * are deterministic so two students with the same link get the same order.
 * @param spec - The series description.
 * @returns The exercises in the order the student will see them, or an
 *   empty array when nothing matches.
 */
export function resolveSeries(spec: SeriesSpec): Exercise[] {
  if (spec.ids && spec.ids.length > 0) {
    const seen = new Set<string>();
    const exercises: Exercise[] = [];
    for (const id of spec.ids) {
      if (seen.has(id)) continue;
      const exercise = findExercise(id);
      if (!exercise) continue;
      seen.add(id);
      exercises.push(exercise);
    }
    if (spec.seed !== undefined) {
      return seededShuffle(exercises, spec.seed);
    }
    return exercises;
  }

  const pool = EXERCISES.filter((exercise) => matchesFilter(exercise, spec));
  const shuffled =
    spec.seed === undefined ? pool : seededShuffle(pool, spec.seed);
  if (spec.count !== undefined && spec.count >= 0) {
    return shuffled.slice(0, spec.count);
  }
  return shuffled;
}

/**
 * Parse a `?series=...` query-string parameter (URL-safe base64-encoded
 * JSON {@link SeriesSpec}). Returns `null` for missing or malformed input
 * so callers can fall back to the default catalogue.
 * @param param - The raw query-string value.
 * @returns The decoded spec, or `null`.
 */
export function decodeSeriesParam(
  param: string | null | undefined,
): SeriesSpec | null {
  if (!param) return null;
  try {
    const padded = param.replaceAll('-', '+').replaceAll('_', '/');
    const padLength = (4 - (padded.length % 4)) % 4;
    const base64 = padded + '='.repeat(padLength);
    const json = atob(base64);
    const parsed = JSON.parse(json) as SeriesSpec;
    if (!parsed || typeof parsed !== 'object') return null;
    return parsed;
  } catch {
    return null;
  }
}

/**
 * Encode a {@link SeriesSpec} as a URL-safe base64 string suitable for the
 * `?series=` query parameter. Round-trips cleanly through
 * {@link decodeSeriesParam}.
 * @param spec - The series to encode.
 * @returns The opaque URL-safe token.
 */
export function encodeSeriesParam(spec: SeriesSpec): string {
  const json = JSON.stringify(spec);
  const base64 = btoa(json);
  return base64.replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
}

function matchesFilter(exercise: Exercise, spec: SeriesSpec): boolean {
  if (
    spec.kinds &&
    spec.kinds.length > 0 &&
    !spec.kinds.includes(exercise.kind)
  ) {
    return false;
  }
  if (
    spec.levels &&
    spec.levels.length > 0 &&
    !spec.levels.includes(exercise.level)
  ) {
    return false;
  }
  if (spec.tags && spec.tags.length > 0) {
    const tags = new Set(exercise.tags);
    if (!spec.tags.some((tag) => tags.has(tag))) return false;
  }
  return true;
}

/**
 * Deterministic Fisher–Yates shuffle backed by the XSadd PRNG. Same seed →
 * same output for the same input list, which is what the teacher-share
 * flow relies on.
 * @param list - The list to shuffle.
 * @param seed - The PRNG seed.
 * @returns A new shuffled array (original is untouched).
 */
export function seededShuffle<T>(list: readonly T[], seed: number): T[] {
  const rng = new XSadd(seed);
  const result = list.slice();
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng.getFloat() * (i + 1));
    const a = result[i];
    const b = result[j];
    if (a === undefined || b === undefined) continue;
    result[i] = b;
    result[j] = a;
  }
  return result;
}
