import type { FunctionalKey, Molecule } from '../data/molecules.ts';
import type { Exercise } from '../types.ts';

const FUNCTION_HINT: Partial<Record<FunctionalKey, string>> = {
  alcohol:
    'Look for an -OH — it becomes the "-ol" suffix (or "hydroxy-" prefix).',
  ketone: 'A C=O in the middle of a chain → "-one" suffix with a locant.',
  aldehyde: 'A C=O at the end of a chain → "-al" suffix (no locant needed).',
  carboxylicAcid:
    'A -COOH → "-oic acid" suffix; it is the most senior of the common functions.',
  ester: 'A -C(=O)O- → "alkyl …-oate" — name the O-side as a prefix alkyl.',
  amide: 'A -C(=O)N → "-amide" suffix; substituents on nitrogen carry "N-".',
  nitrile: 'A -C≡N → "-nitrile" suffix; the C is part of the parent chain.',
  amine: 'An -NH₂ / -NHR → "-amine" suffix or "amino-" prefix.',
  ether: 'An R-O-R\' → the smaller side becomes a "…-oxy" prefix.',
  halogen: 'Halogens are always prefixes: fluoro-, chloro-, bromo-, iodo-.',
  alcene: 'A C=C → swap "-ane" for "-ene"; locant chosen to be lowest.',
  alcyne: 'A C≡C → swap "-ane" for "-yne".',
  aromatic:
    'A benzene ring → either name the ring as the parent or use phenyl-.',
  cyclo: 'A ring → add the "cyclo-" prefix to the chain name.',
  stereochemistry:
    'Stereodescriptors go in parentheses with their locants: (R)-, (S)-, (E)-, (Z)-.',
  thiol: 'An -SH → "-thiol" suffix.',
  imine: 'A C=N → "-imine" suffix.',
  anhydride: 'A R-C(=O)-O-C(=O)-R\' → "-oic anhydride".',
  heterocyclic:
    'A ring containing a non-carbon atom — usually keeps its trivial name (pyridine, furan…).',
};

function chainLengthHint(length: number, base: string): string {
  return `The longest chain has ${length} carbons → root "${base}".`;
}

const LENGTH_ROOT = [
  '',
  'meth',
  'eth',
  'prop',
  'but',
  'pent',
  'hex',
  'hept',
  'oct',
  'non',
  'dec',
];

/**
 * Generate a short ordered list of hints for an exercise. The first hint
 * is intentionally vague (a chain-length nudge), subsequent ones add a
 * functional-group nudge for each tag, and the last one mentions
 * stereochemistry when relevant.
 * @param exercise - The exercise to build hints for.
 * @returns 2 to 4 hints, from vague to specific.
 */
export function buildHints(exercise: Exercise): string[] {
  const hints: string[] = [];
  const molecule = exercise.molecule;
  const carbonCount = countCarbons(molecule);
  const root = LENGTH_ROOT[carbonCount];
  if (root) hints.push(chainLengthHint(carbonCount, root));

  for (const tag of molecule.tags) {
    if (tag === 'trivial' || tag === 'other') continue;
    const hint = FUNCTION_HINT[tag];
    if (hint && !hints.includes(hint)) hints.push(hint);
    if (hints.length >= 3) break;
  }

  if (exercise.kind === 'structure-to-name') {
    hints.push(
      'Number the chain so the senior function has the lowest locant.',
    );
  } else {
    hints.push(
      'Re-read the name once more: every locant in the name maps to one atom in the drawing.',
    );
  }
  return hints;
}

function countCarbons(molecule: Molecule): number {
  let count = 0;
  for (const character of molecule.smiles) {
    if (character === 'C' || character === 'c') count += 1;
  }
  return count;
}
