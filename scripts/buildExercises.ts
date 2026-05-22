import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { Molecule } from 'openchemlib';

const TSV_PATH = join(import.meta.dirname, 'exercises.tsv');
const OUTPUT_PATH = join(
  import.meta.dirname,
  '..',
  'src',
  'data',
  'molecules.generated.ts',
);

const FUNCTIONAL_COLUMNS = [
  'trivial',
  'stereochemistry',
  'cyclo',
  'alcane',
  'alcene',
  'alcyne',
  'aromatic',
  'alcohol',
  'ketone',
  'carboxylicAcid',
  'halogen',
  'nitrile',
  'amine',
  'ether',
  'aldehyde',
  'ester',
  'amide',
  'imine',
  'anhydride',
  'thiol',
  'heterocyclic',
  'other',
] as const;

type FunctionalKey = (typeof FUNCTIONAL_COLUMNS)[number];

function toCamelCase(value: string): string {
  return value.replaceAll(/\s+([a-z])/g, (_match, letter: string) =>
    letter.toUpperCase(),
  );
}

interface ParsedMolecule {
  id: string;
  smiles: string;
  idCode: string;
  name: string;
  name2: string;
  trivial: string;
  level: number;
  tags: FunctionalKey[];
}

const tsv = readFileSync(TSV_PATH, 'utf8');
const lines = tsv.split(/\r?\n/);
const headerRow = lines[0];
if (!headerRow) throw new Error('TSV file is empty');
const header = headerRow.split('\t');

const molecules: ParsedMolecule[] = [];
let skippedNoSmiles = 0;
let skippedInvalid = 0;

for (let i = 4; i < lines.length; i++) {
  const lineRaw = lines[i];
  if (!lineRaw) continue;
  const cells = lineRaw.split('\t');
  const id = cells[1]?.trim();
  const smiles = cells[2]?.trim();
  const name = cells[3]?.trim();
  const name2 = cells[4]?.trim() ?? '';
  const trivial = cells[5]?.trim() ?? '';
  const levelRaw = cells[6]?.trim();
  if (!id || !smiles || !name || !levelRaw) {
    skippedNoSmiles++;
    continue;
  }
  const level = Number(levelRaw);
  if (!Number.isFinite(level)) {
    skippedNoSmiles++;
    continue;
  }

  let idCode: string;
  try {
    const molecule = Molecule.fromSmiles(smiles);
    idCode = molecule.getIDCode();
  } catch (error) {
    skippedInvalid++;
    process.stderr.write(
      `Skipping ${id} (invalid SMILES "${smiles}"): ${String(error)}\n`,
    );
    continue;
  }

  const tags: FunctionalKey[] = [];
  for (let columnIndex = 7; columnIndex < header.length; columnIndex++) {
    const value = cells[columnIndex]?.trim();
    if (!value) continue;
    const rawKey = header[columnIndex]?.trim();
    if (!rawKey) continue;
    const key = toCamelCase(rawKey) as FunctionalKey;
    if (FUNCTIONAL_COLUMNS.includes(key)) {
      tags.push(key);
    }
  }

  molecules.push({
    id,
    smiles,
    idCode,
    name,
    name2,
    trivial,
    level,
    tags,
  });
}

process.stdout.write(
  `Parsed ${molecules.length} molecules ` +
    `(skipped ${skippedNoSmiles} empty / ${skippedInvalid} invalid)\n`,
);

const seenIds = new Set<string>();
for (const molecule of molecules) {
  if (seenIds.has(molecule.id)) {
    throw new Error(`Duplicate exercise id "${molecule.id}"`);
  }
  seenIds.add(molecule.id);
}

const generated = `/* eslint-disable */
// AUTO-GENERATED FILE — do not edit by hand.
// Regenerate with: npm run build-exercises
// Source: scripts/exercises.tsv

import type { Molecule } from './molecules.ts';

export const MOLECULES: readonly Molecule[] = ${JSON.stringify(molecules, null, 2)};
`;

writeFileSync(OUTPUT_PATH, generated);
process.stdout.write(`Wrote ${OUTPUT_PATH}\n`);
