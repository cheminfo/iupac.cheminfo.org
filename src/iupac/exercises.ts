import { MOLECULES } from '../data/molecules.generated.ts';
import type { Molecule } from '../data/molecules.ts';
import { levelFromNumber } from '../data/molecules.ts';
import type { Exercise, ExerciseKind } from '../types.ts';

const KIND_PREFIX: Record<ExerciseKind, string> = {
  'name-to-structure': 'nts',
  'structure-to-name': 'stn',
};

/**
 * Build the deterministic catalogue of exercises — every molecule yields
 * exactly two exercises, one of each kind. The order matches the source
 * spreadsheet; callers that want a different order (e.g. seeded shuffle
 * for a teacher link) should derive their own list with {@link findExercise}.
 * @returns The frozen exercise catalogue.
 */
export function buildExerciseCatalogue(): Exercise[] {
  const list: Exercise[] = [];
  for (const molecule of MOLECULES) {
    list.push(
      makeExercise(molecule, 'name-to-structure'),
      makeExercise(molecule, 'structure-to-name'),
    );
  }
  return list;
}

export const EXERCISES: readonly Exercise[] = buildExerciseCatalogue();

const EXERCISES_BY_ID = new Map<string, Exercise>(
  EXERCISES.map((exercise) => [exercise.id, exercise]),
);

/**
 * Compose the per-exercise composite id from a molecule id and a kind.
 * Centralised so URLs, storage keys and lookups stay consistent.
 * @param moleculeId - The molecule the exercise is based on.
 * @param kind - Whether the student is asked to draw or to name.
 * @returns The composite id (`nts:<moleculeId>` or `stn:<moleculeId>`).
 */
export function exerciseId(moleculeId: string, kind: ExerciseKind): string {
  return `${KIND_PREFIX[kind]}:${moleculeId}`;
}

/**
 * Look up an exercise by its composite id.
 * @param id - Composite id, as produced by {@link exerciseId}.
 * @returns The exercise, or `undefined` if the id is unknown.
 */
export function findExercise(id: string): Exercise | undefined {
  return EXERCISES_BY_ID.get(id);
}

function makeExercise(molecule: Molecule, kind: ExerciseKind): Exercise {
  return {
    id: exerciseId(molecule.id, kind),
    moleculeId: molecule.id,
    kind,
    level: levelFromNumber(molecule.level),
    title: molecule.name,
    tags: molecule.tags,
    molecule,
  };
}
