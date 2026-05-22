import { expect, test } from 'vitest';

import type { Molecule } from '../../data/molecules.ts';
import type { Exercise } from '../../types.ts';
import { smilesToIdCode } from '../structure.ts';
import { validateExercise } from '../validate.ts';

/**
 * Helper that throws when a SMILES used in the test fixture fails to parse
 * — that means the test data is broken, not the system under test.
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

const sampleMolecule: Molecule = {
  id: 'sample-1',
  smiles: 'C[C@H](Cl)CC',
  idCode: idCode('C[C@H](Cl)CC'),
  name: '(2R)-2-chlorobutane',
  name2: '(R)-2-chlorobutane',
  trivial: '',
  level: 100,
  tags: ['stereochemistry', 'alcane', 'halogen'],
};

function nameExercise(): Exercise {
  return {
    id: 'stn:sample-1',
    moleculeId: sampleMolecule.id,
    kind: 'structure-to-name',
    level: 'beginner',
    title: sampleMolecule.name,
    tags: sampleMolecule.tags,
    molecule: sampleMolecule,
  };
}

function drawExercise(): Exercise {
  return { ...nameExercise(), id: 'nts:sample-1', kind: 'name-to-structure' };
}

test('structure-to-name: accepts the primary IUPAC name', () => {
  const result = validateExercise(nameExercise(), '(2R)-2-chlorobutane');

  expect(result.passed).toBe(true);
});

test('structure-to-name: accepts the alternative IUPAC name', () => {
  const result = validateExercise(nameExercise(), '(R)-2-chlorobutane');

  expect(result.passed).toBe(true);
});

test('structure-to-name: rejects empty input with a tutor-style reason', () => {
  const result = validateExercise(nameExercise(), '   ');

  expect(result.passed).toBe(false);
  expect(result.reason).toMatch(/type the iupac name/i);
});

test('structure-to-name: flags trivial-name attempts specifically', () => {
  const trivialMolecule: Molecule = { ...sampleMolecule, trivial: 'limonene' };
  const exercise: Exercise = {
    ...nameExercise(),
    molecule: trivialMolecule,
    title: trivialMolecule.name,
  };
  const result = validateExercise(exercise, 'limonene');

  expect(result.passed).toBe(false);
  expect(result.reason).toMatch(/trivial name/i);
});

test('name-to-structure: passes when idCode matches', () => {
  const result = validateExercise(drawExercise(), sampleMolecule.idCode);

  expect(result.passed).toBe(true);
});

test('name-to-structure: detects missing stereochemistry', () => {
  const achiral = idCode('CC(Cl)CC');
  const result = validateExercise(drawExercise(), achiral);

  expect(result.passed).toBe(false);
  expect(result.reason).toMatch(/stereochemistry/i);
});

test('name-to-structure: rejects an empty drawing', () => {
  const result = validateExercise(drawExercise(), '');

  expect(result.passed).toBe(false);
  expect(result.reason).toMatch(/draw the structure/i);
});

test('name-to-structure: rejects a completely different skeleton', () => {
  const other = idCode('CCCCN');
  const result = validateExercise(drawExercise(), other);

  expect(result.passed).toBe(false);
  expect(result.reason).toMatch(/different structure/i);
});
