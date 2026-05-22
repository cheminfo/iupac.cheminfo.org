import type { FunctionalKey, Molecule } from './data/molecules.ts';

export type ExerciseLevel = 'beginner' | 'intermediate' | 'advanced';

/** Two kinds of pedagogic exercise generated from one molecule. */
export type ExerciseKind = 'name-to-structure' | 'structure-to-name';

/**
 * Exercise instance shown to the student. Always derived from a single
 * {@link Molecule}; the kind determines which question is asked.
 */
export interface Exercise {
  /**
   * Composite id `${kind}:${molecule.id}` — unique per (molecule, kind)
   * pair. Used in the URL hash and as the localStorage key.
   */
  id: string;
  /** Stable id of the underlying molecule (matches `molecule.id`). */
  moleculeId: string;
  kind: ExerciseKind;
  level: ExerciseLevel;
  /** Title shown in the exercise menu (e.g. `(R)-1-phenylethan-1-ol`). */
  title: string;
  /** All functional / structural tags of the underlying molecule. */
  tags: FunctionalKey[];
  /** The molecule itself, kept so the validators and renderers don't re-look it up. */
  molecule: Molecule;
}

export type ExerciseStatus = 'idle' | 'attempted' | 'solved';

/** Persisted per-exercise state (lives in `localStorage`). */
export interface ExerciseState {
  /**
   * Student's answer for `structure-to-name` exercises (the typed IUPAC
   * name). Ignored for `name-to-structure` exercises.
   */
  answerName: string;
  /**
   * Student's answer for `name-to-structure` exercises (the OCL idCode of
   * the molecule they drew). Empty until the student touches the editor.
   */
  answerIdCode: string;
  status: ExerciseStatus;
  hintsRevealed: number;
  showSolution: boolean;
}

/** Outcome of running the validator against the student's current answer. */
export interface ValidationResult {
  passed: boolean;
  /** Compile / parse error (e.g. the drawn structure has zero atoms). */
  error: string | null;
  /** Human-readable feedback shown when the answer is partially correct. */
  reason: string | null;
}

/**
 * Tutorial step shown on the Tutorial page. Each step preloads a molecule
 * and a short description (with `[[term]]` glossary markers).
 */
export interface TutorialStep {
  title: string;
  description: string;
  level: ExerciseLevel;
  /** Reference molecule id from `MOLECULES`. */
  moleculeId: string;
  /**
   * Optional override of the structure to display — handy for sketch-only
   * steps that have no entry in the catalogue. When provided, takes
   * precedence over `moleculeId`.
   * @default undefined
   */
  customSmiles?: string;
  /** Optional override of the name shown next to the structure. */
  customName?: string;
}
