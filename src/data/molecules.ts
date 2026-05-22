/**
 * Functional / structural tags carried by every molecule in the catalogue.
 * Used both for grouping in the cheatsheet and as filter criteria when the
 * teacher builds a custom exercise series.
 */
export type FunctionalKey =
  | 'trivial'
  | 'stereochemistry'
  | 'cyclo'
  | 'alcane'
  | 'alcene'
  | 'alcyne'
  | 'aromatic'
  | 'alcohol'
  | 'ketone'
  | 'carboxylicAcid'
  | 'halogen'
  | 'nitrile'
  | 'amine'
  | 'ether'
  | 'aldehyde'
  | 'ester'
  | 'amide'
  | 'imine'
  | 'anhydride'
  | 'thiol'
  | 'heterocyclic'
  | 'other';

/**
 * One molecule entry — the raw material from which both kinds of exercise
 * (name-to-structure, structure-to-name) are derived. The `idCode` is
 * computed at build time by OpenChemLib so the runtime answer check never
 * depends on the student's SMILES round-tripping the parser.
 */
export interface Molecule {
  /** Short opaque id used in URLs and as the localStorage key. */
  id: string;
  /** Canonical SMILES from the source spreadsheet. */
  smiles: string;
  /** OpenChemLib idCode (canonicalised at build time). */
  idCode: string;
  /**
   * Molecular formula in the `react-mf` input string format (e.g.
   * `C8H9I`). Used in the exercise menu for `structure-to-name`
   * entries so the IUPAC name doesn't leak the answer.
   */
  mf: string;
  /** Preferred IUPAC name. Matched case- and whitespace-insensitively. */
  name: string;
  /**
   * Alternative IUPAC name (an older but still-accepted form, or a
   * conventional alias). Empty when none exists.
   */
  name2: string;
  /** Common / trivial name (e.g. `limonene`). Empty when none exists. */
  trivial: string;
  /**
   * Pedagogic difficulty inherited from the source spreadsheet:
   *  - 100 → beginner
   *  - 200 → intermediate
   *  - 300 → advanced
   */
  level: number;
  /** Functional / structural classification flags. */
  tags: FunctionalKey[];
}

/**
 * Map the numeric level from the spreadsheet to the pedagogic level used
 * across the UI (color, sort order, filter chips).
 * @param level - Numeric level (100 / 200 / 300).
 * @returns The string level used by the React components.
 */
export function levelFromNumber(
  level: number,
): 'beginner' | 'intermediate' | 'advanced' {
  if (level >= 300) return 'advanced';
  if (level >= 200) return 'intermediate';
  return 'beginner';
}
