import type { ExerciseLevel, TutorialStep } from '../types.ts';

/**
 * Metadata for one of the three tutorial levels. The colors are used both
 * for the group background and for the active button highlight.
 */
export interface TutorialLevelMeta {
  level: ExerciseLevel;
  label: string;
  /** Light background color applied to the group container. */
  background: string;
  /** Slightly darker color used for the currently selected step. */
  activeBackground: string;
}

export const TUTORIAL_LEVELS: TutorialLevelMeta[] = [
  {
    level: 'beginner',
    label: 'Basics: chains & roots',
    background: '#d1fae5',
    activeBackground: '#6ee7b7',
  },
  {
    level: 'intermediate',
    label: 'Substituents & functions',
    background: '#fef3c7',
    activeBackground: '#fcd34d',
  },
  {
    level: 'advanced',
    label: 'Stereochemistry & rings',
    background: '#fce7f3',
    activeBackground: '#f9a8d4',
  },
];

/**
 * Guided tour through IUPAC nomenclature. Each step references a real
 * molecule from the catalogue (so the structure renderer can pull a clean
 * SMILES) and a short paragraph with `[[term]]` markers that surface the
 * glossary tooltip on hover.
 */
export const TUTORIAL_STEPS: TutorialStep[] = [
  {
    level: 'beginner',
    moleculeId: '9podb2',
    title: 'Carbon counts: the alkane series',
    description:
      'A name starts with the [[root]] — the longest carbon chain. Six carbons is "hex", eight is "oct". The "-ane" suffix marks a saturated chain (only single bonds). Cyclic molecules add the "cyclo-" prefix.',
  },
  {
    level: 'beginner',
    moleculeId: 'zmu1ya',
    title: 'Locants and prefixes',
    description:
      'Once the [[root]] is chosen, each substituent gets a [[prefix]] with a [[locant]] (its position number). Numbering is chosen to make the locants as small as possible — here chloro is at position 1 because that gives 1,3 (instead of 2,4).',
  },
  {
    level: 'beginner',
    moleculeId: '3iy1r6',
    title: 'Multipliers',
    description:
      'The same substituent twice → use a [[multiplier]] (di, tri, tetra…). "1,1-dichloroethane" tells you both chlorines sit on the same carbon. Multipliers do not count in the alphabetical order of substituents.',
  },
  {
    level: 'intermediate',
    moleculeId: '9xwxg9',
    title: 'Suffixes — carboxylic acid wins',
    description:
      'A [[suffix]] names the most [[senior]] function. The carboxylic acid is high in the seniority list, so "butanoic acid" ends with "-oic acid" rather than reporting the COOH as a prefix.',
  },
  {
    level: 'intermediate',
    moleculeId: '5bus19',
    title: 'Ketones: -one with a locant',
    description:
      'A ketone uses "-one" as the [[suffix]]. The carbonyl carbon must carry the lowest possible locant — "pentan-2-one", not "pentan-4-one".',
  },
  {
    level: 'intermediate',
    moleculeId: '8mxmb5',
    title: 'Aldehydes: -al at carbon 1',
    description:
      'An aldehyde is always at the end of a chain, so its carbonyl carbon is C1 by definition. The "-al" [[suffix]] needs no locant.',
  },
  {
    level: 'intermediate',
    moleculeId: '2j4418',
    title: 'Ethers: -oxy- prefix',
    description:
      'An ether is named as the smaller -O-R group (an [[alkyl]] "oxy" prefix) bolted onto the larger chain. "1-ethoxybutane" = butane with an ethoxy on C1. The older "ethyl butyl ether" form is still accepted.',
  },
  {
    level: 'intermediate',
    moleculeId: '8uj7d3',
    title: 'Nitriles: -nitrile counts the C≡N carbon',
    description:
      'A nitrile [[suffix]] is "-nitrile". The C of C≡N is part of the [[root]], so propanenitrile = CH₃-CH₂-C≡N (three carbons total). The old "alkyl cyanide" naming counts the C≡N separately.',
  },
  {
    level: 'advanced',
    moleculeId: '9ruyf1',
    title: 'Halogens on benzene',
    description:
      'On an aromatic ring, the three [[halogen]] substituents sort alphabetically (bromo, chloro, nitro… with "nitro" coming after "chloro" by letters), and numbering minimises the locant set: 1,3,5 here beats 2,4,6.',
  },
  {
    level: 'advanced',
    moleculeId: '4td2x5',
    title: 'Absolute configuration: R / S',
    description:
      'Stereocenters get an (R) or (S) descriptor — see the [[stereochemistry]] glossary entry for the assignment rules. Multiple centers are listed together with their locants: (2R,3R)-3-bromo-2-chloropentane.',
  },
  {
    level: 'advanced',
    moleculeId: '5ogdq8',
    title: 'Double-bond geometry: E / Z',
    description:
      'A double bond is described by (E)- or (Z)-. The descriptor is part of the [[stereochemistry]] prefix; the locant of the bond is reported separately (here, 2 for the "ene").',
  },
  {
    level: 'advanced',
    moleculeId: '8jou4j',
    title: 'Trivial vs IUPAC names',
    description:
      'Some molecules have a long-established trivial name (e.g. "phenethyl alcohol"). The IUPAC name and accepted alternatives are checked; trivial names are listed for context but flagged as "not the IUPAC answer" by the validator.',
  },
];
