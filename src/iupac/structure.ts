import { Molecule } from 'openchemlib';

/**
 * Parse a SMILES string and return the canonical OpenChemLib idCode. The
 * idCode is the canonical identifier we use everywhere to compare two
 * structures — it is independent of atom ordering and of any drawing
 * conventions.
 * @param smiles - The SMILES to canonicalise.
 * @returns The idCode, or `null` if the SMILES does not parse.
 */
export function smilesToIdCode(smiles: string): string | null {
  if (!smiles) return null;
  try {
    return Molecule.fromSmiles(smiles).getIDCode();
  } catch {
    return null;
  }
}

/**
 * Strip stereochemistry from an idCode by round-tripping through SMILES.
 * Used to detect "right skeleton but wrong stereochemistry" answers and
 * surface a specific hint instead of a generic "wrong" message.
 * @param idCode - The canonical idCode.
 * @returns The achiral idCode, or `null` if parsing fails.
 */
export function stripStereochemistry(idCode: string): string | null {
  if (!idCode) return null;
  try {
    const molecule = Molecule.fromIDCode(idCode);
    molecule.stripStereoInformation();
    return molecule.getIDCode();
  } catch {
    return null;
  }
}

/**
 * Check whether the student's drawn structure (encoded as an idCode)
 * matches the expected idCode.
 * @param studentIdCode - idCode produced by the structure editor.
 * @param expectedIdCode - idCode stored on the molecule.
 * @returns Discriminated result with a flag for the partial-match case
 *   (right skeleton, wrong stereochemistry).
 */
export function checkStructure(
  studentIdCode: string,
  expectedIdCode: string,
): { passed: boolean; missingStereochemistry: boolean } {
  if (!studentIdCode) {
    return { passed: false, missingStereochemistry: false };
  }
  if (studentIdCode === expectedIdCode) {
    return { passed: true, missingStereochemistry: false };
  }
  const studentAchiral = stripStereochemistry(studentIdCode);
  const expectedAchiral = stripStereochemistry(expectedIdCode);
  if (
    studentAchiral !== null &&
    expectedAchiral !== null &&
    studentAchiral === expectedAchiral
  ) {
    return { passed: false, missingStereochemistry: true };
  }
  return { passed: false, missingStereochemistry: false };
}
