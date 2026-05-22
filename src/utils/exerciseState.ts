import { findExercise } from '../iupac/exercises.ts';
import type { ExerciseState } from '../types.ts';

import { parseHashPath } from './router.ts';
import {
  STORAGE_KEYS,
  readJson,
  readString,
  writeJson,
  writeString,
} from './storage.ts';

export type StateMap = Record<string, ExerciseState>;

/**
 * Build a fresh, blank exercise state used as the starting point and as
 * the default for any field missing from older `localStorage` snapshots.
 * @returns A default `ExerciseState`.
 */
export function defaultState(): ExerciseState {
  return {
    answerName: '',
    answerIdCode: '',
    status: 'idle',
    hintsRevealed: 0,
    showSolution: false,
  };
}

/**
 * Load the saved exercise progress map from `localStorage`, migrating
 * older entries that may be missing fields.
 * @returns The state map; an empty object when nothing is stored.
 */
export function loadState(): StateMap {
  const parsed = readJson(STORAGE_KEYS.exerciseStates);
  if (!parsed || typeof parsed !== 'object') return {};
  const migrated: StateMap = {};
  for (const [id, value] of Object.entries(
    parsed as Record<string, Partial<ExerciseState>>,
  )) {
    migrated[id] = { ...defaultState(), ...value };
  }
  return migrated;
}

/**
 * Persist the full exercise progress map to `localStorage`.
 * @param state - The state map to save.
 */
export function saveState(state: StateMap): void {
  writeJson(STORAGE_KEYS.exerciseStates, state);
}

/**
 * Read the id of the exercise the student was last looking at, if any.
 * Returns `null` when nothing is stored or the stored id is no longer a
 * known exercise.
 * @returns A valid exercise id or `null`.
 */
export function readLastExerciseId(): string | null {
  const stored = readString(STORAGE_KEYS.lastExercise);
  if (!stored) return null;
  return findExercise(stored) ? stored : null;
}

/**
 * Save the id of the active exercise so the student returns to it next time.
 * @param id - The exercise id to remember.
 */
export function writeLastExerciseId(id: string): void {
  writeString(STORAGE_KEYS.lastExercise, id);
}

/**
 * Extract a valid exercise id from a URL hash like `#/exercises/<id>`.
 * Returns `null` when the hash does not target the exercises tab or the
 * id is not a known exercise.
 * @param hash - The hash string to parse.
 * @returns A valid exercise id or `null`.
 */
export function readExerciseIdFromHash(hash: string): string | null {
  const segments = parseHashPath(hash);
  if (segments[0] !== 'exercises') return null;
  const id = segments[1];
  if (!id) return null;
  const decoded = decodeURIComponent(id);
  return findExercise(decoded) ? decoded : null;
}
