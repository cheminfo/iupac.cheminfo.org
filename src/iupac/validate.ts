import type { Exercise, ValidationResult } from '../types.ts';

import { isNameAccepted } from './normalize.ts';
import { checkStructure } from './structure.ts';

/**
 * Build the list of accepted IUPAC names for a molecule. The trivial name
 * is intentionally **not** included by default — a student who answers
 * `limonene` instead of the IUPAC name has not done the exercise, even
 * though the chemistry is correct.
 * @param exercise - The exercise to derive accepted names for.
 * @returns The list of strings any of which makes the answer correct.
 */
export function acceptedNamesFor(exercise: Exercise): string[] {
  const names = [exercise.molecule.name];
  if (exercise.molecule.name2) names.push(exercise.molecule.name2);
  return names;
}

/**
 * Validate the student's current answer against the exercise. The shape
 * of `answer` depends on the kind:
 *  - `structure-to-name` → the typed text
 *  - `name-to-structure` → the OCL idCode of the drawn molecule
 * @param exercise - The exercise being attempted.
 * @param answer - Either the typed name or the drawn idCode.
 * @returns The validation result with a human-readable reason on failure.
 */
export function validateExercise(
  exercise: Exercise,
  answer: string,
): ValidationResult {
  if (exercise.kind === 'structure-to-name') {
    return validateName(exercise, answer);
  }
  return validateStructure(exercise, answer);
}

function validateName(exercise: Exercise, answer: string): ValidationResult {
  const trimmed = answer.trim();
  if (!trimmed) {
    return {
      passed: false,
      error: null,
      reason: 'Type the IUPAC name in the input above.',
    };
  }
  if (isNameAccepted(trimmed, acceptedNamesFor(exercise))) {
    return { passed: true, error: null, reason: null };
  }
  if (
    exercise.molecule.trivial &&
    isNameAccepted(trimmed, [exercise.molecule.trivial])
  ) {
    return {
      passed: false,
      error: null,
      reason: `"${exercise.molecule.trivial}" is the trivial name — we want the IUPAC name here.`,
    };
  }
  return {
    passed: false,
    error: null,
    reason: 'Not quite — check substituent positions, locants, and suffixes.',
  };
}

function validateStructure(
  exercise: Exercise,
  answer: string,
): ValidationResult {
  if (!answer) {
    return {
      passed: false,
      error: null,
      reason: 'Draw the structure in the editor above.',
    };
  }
  const result = checkStructure(answer, exercise.molecule.idCode);
  if (result.passed) {
    return { passed: true, error: null, reason: null };
  }
  if (result.missingStereochemistry) {
    return {
      passed: false,
      error: null,
      reason:
        'The skeleton is right, but the stereochemistry is missing or wrong.',
    };
  }
  return {
    passed: false,
    error: null,
    reason: 'Different structure — re-read the name and check each locant.',
  };
}
