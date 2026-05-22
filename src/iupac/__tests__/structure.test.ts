import { expect, test } from 'vitest';

import {
  checkStructure,
  smilesToIdCode,
  stripStereochemistry,
} from '../structure.ts';

/**
 * Helper that throws when a SMILES used in the test fixture fails to parse
 * — that means the test data is broken, not the system under test, so the
 * error should surface immediately rather than be silently asserted around.
 * @param smiles - SMILES to parse.
 * @returns The canonical idCode.
 */
function idCode(smiles: string): string {
  const result = smilesToIdCode(smiles);
  if (result === null) {
    throw new Error(`Test fixture has invalid SMILES: ${smiles}`);
  }
  return result;
}

test('smilesToIdCode canonicalises atom ordering', () => {
  const a = idCode('CCO');
  const b = idCode('OCC');

  expect(a).toBe(b);
});

test('smilesToIdCode returns null on garbage input', () => {
  expect(smilesToIdCode('not-a-smiles-XYZ@@@')).toBeNull();
  expect(smilesToIdCode('')).toBeNull();
});

test('stripStereochemistry equates R and S enantiomers', () => {
  const r = idCode('C[C@H](Cl)CC');
  const s = idCode('C[C@@H](Cl)CC');

  expect(r).not.toBe(s);
  expect(stripStereochemistry(r)).toBe(stripStereochemistry(s));
});

test('checkStructure passes on exact match', () => {
  const expected = idCode('CCCC=O');
  const student = idCode('O=CCCC');

  expect(checkStructure(student, expected)).toStrictEqual({
    passed: true,
    missingStereochemistry: false,
  });
});

test('checkStructure flags wrong stereochemistry when skeleton matches', () => {
  const expected = idCode('C[C@H](Cl)CC');
  const studentAchiral = idCode('CC(Cl)CC');

  expect(checkStructure(studentAchiral, expected)).toStrictEqual({
    passed: false,
    missingStereochemistry: true,
  });
});

test('checkStructure fails cleanly on different skeleton', () => {
  const expected = idCode('CCCCO');
  const student = idCode('CCCCN');

  expect(checkStructure(student, expected)).toStrictEqual({
    passed: false,
    missingStereochemistry: false,
  });
});

test('checkStructure handles empty student input', () => {
  const expected = idCode('CCO');

  expect(checkStructure('', expected)).toStrictEqual({
    passed: false,
    missingStereochemistry: false,
  });
});
