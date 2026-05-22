import { XSadd } from 'ml-xsadd';

import type { FunctionalKey } from '../data/molecules.ts';
import type { Exercise, ExerciseKind, ExerciseLevel } from '../types.ts';

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
