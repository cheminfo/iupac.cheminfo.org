/**
 * One row in the cheatsheet — usually a syntax fragment in the left
 * column and a short explanation in the right column.
 */
export interface ReferenceItem {
  /** Token shown in the left cell of the table. */
  syntax: string;
  /** Short description shown in the right cell. */
  description: string;
}

export interface ReferenceSection {
  title: string;
  items: ReferenceItem[];
}

/**
 * The chain-length naming table — the most-used reference in any
 * nomenclature class.
 */
export const CHAIN_LENGTHS: ReferenceItem[] = [
  { syntax: '1 — meth-', description: 'methane / methyl' },
  { syntax: '2 — eth-', description: 'ethane / ethyl' },
  { syntax: '3 — prop-', description: 'propane / propyl' },
  { syntax: '4 — but-', description: 'butane / butyl' },
  { syntax: '5 — pent-', description: 'pentane / pentyl' },
  { syntax: '6 — hex-', description: 'hexane / hexyl' },
  { syntax: '7 — hept-', description: 'heptane / heptyl' },
  { syntax: '8 — oct-', description: 'octane / octyl' },
  { syntax: '9 — non-', description: 'nonane / nonyl' },
  { syntax: '10 — dec-', description: 'decane / decyl' },
];

/**
 * The nine rules from the IUPAC course handout, condensed to one line each
 * so they can be printed on a single sheet.
 */
export const NAMING_RULES: ReferenceItem[] = [
  {
    syntax: 'Rule 1',
    description:
      'Pick the longest carbon chain that carries the most suffix functions — that is the root.',
  },
  {
    syntax: 'Rule 2',
    description:
      'In case of a tie, take the chain with the most unsaturations.',
  },
  {
    syntax: 'Rule 3',
    description: 'Number the chain so the senior suffix has the lowest locant.',
  },
  {
    syntax: 'Rule 4',
    description:
      'On a tie, give the lowest locant to the unsaturation (-ene / -yne).',
  },
  {
    syntax: 'Rule 5',
    description: 'Substituents are listed alphabetically before the root.',
  },
  {
    syntax: 'Rule 6',
    description:
      'Pick the locant set giving the lowest first-different number (compare term by term).',
  },
  {
    syntax: 'Rule 7',
    description:
      'Same substituent multiple times → use di, tri, tetra… (does not count for alphabetical order).',
  },
  {
    syntax: 'Rule 8',
    description:
      'Insert "a" or "e" before a suffix to avoid two consonants (propa-1,2-diene; pentane-2,3-diol).',
  },
  {
    syntax: 'Rule 9',
    description:
      'Branched groups can use iso-, sec-, tert-. sec- and tert- are written in parentheses and do not count alphabetically; iso- does.',
  },
];

/**
 * Cheatsheet block layout — a list of sections rendered side-by-side.
 */
export const REFERENCE_SECTIONS: ReferenceSection[] = [
  { title: 'Chain length', items: CHAIN_LENGTHS },
  { title: 'Naming rules (in order of application)', items: NAMING_RULES },
  {
    title: 'Stereodescriptors',
    items: [
      {
        syntax: '(E)- / (Z)-',
        description: 'double-bond geometry (CIP rules)',
      },
      {
        syntax: '(R)- / (S)-',
        description: 'absolute configuration of a stereocenter',
      },
      {
        syntax: 'cis- / trans-',
        description: 'relative on a ring (older form)',
      },
      {
        syntax: 'erythro / threo',
        description: 'relative two-center descriptors (historical)',
      },
    ],
  },
  {
    title: 'Common branched substituents',
    items: [
      { syntax: 'isopropyl', description: '(CH₃)₂CH–' },
      { syntax: 'isobutyl', description: '(CH₃)₂CHCH₂–' },
      {
        syntax: 'sec-butyl',
        description: 'CH₃CH₂CH(CH₃)– (counts alphabetically as "b")',
      },
      {
        syntax: 'tert-butyl',
        description: '(CH₃)₃C– (counts alphabetically as "b")',
      },
      { syntax: 'phenyl', description: 'C₆H₅– (benzene as substituent)' },
      { syntax: 'benzyl', description: 'C₆H₅CH₂– (phenyl + CH₂)' },
      { syntax: 'vinyl', description: 'CH₂=CH–' },
      { syntax: 'allyl', description: 'CH₂=CHCH₂–' },
    ],
  },
];

/**
 * A functional group ready to be displayed in the printable cheatsheet —
 * IUPAC name, suffix/prefix forms, an exemplar SMILES + IUPAC name and a
 * short note.
 */
export interface FunctionalGroup {
  /** Family name (e.g. "Alcohol"). */
  name: string;
  /** Suffix form used as the senior suffix. */
  suffix?: string;
  /** Prefix form used when demoted. */
  prefix?: string;
  /** SMILES of a canonical example. */
  exampleSmiles: string;
  /** IUPAC name of the canonical example. */
  exampleName: string;
  /** Short note about seniority / quirks. */
  note?: string;
}

/**
 * Functional-group table from the PDF handout — every row carries both the
 * suffix (when applicable) and a worked example.
 */
export const FUNCTIONAL_GROUPS: FunctionalGroup[] = [
  {
    name: 'Alkane',
    suffix: '-ane',
    exampleSmiles: 'CCCC',
    exampleName: 'butane',
  },
  {
    name: 'Cycloalkane',
    prefix: 'cyclo-',
    suffix: '-ane',
    exampleSmiles: 'C1CCCCC1',
    exampleName: 'cyclohexane',
  },
  {
    name: 'Alkene',
    suffix: '-ene',
    exampleSmiles: 'C=CC',
    exampleName: 'prop-1-ene',
    note: 'vinyl- / allyl- when used as a substituent',
  },
  {
    name: 'Alkyne',
    suffix: '-yne',
    exampleSmiles: 'C#CC',
    exampleName: 'prop-1-yne',
  },
  {
    name: 'Aromatic',
    prefix: 'phenyl- / benzyl-',
    exampleSmiles: 'Cc1ccccc1',
    exampleName: 'methylbenzene (toluene)',
  },
  {
    name: 'Halide',
    prefix: 'fluoro- / chloro- / bromo- / iodo-',
    exampleSmiles: 'ClCCF',
    exampleName: '1-chloro-2-fluoroethane',
    note: 'always a prefix — never a suffix',
  },
  {
    name: 'Alcohol',
    suffix: '-ol',
    prefix: 'hydroxy-',
    exampleSmiles: 'CCCO',
    exampleName: 'propan-1-ol',
  },
  {
    name: 'Phenol',
    suffix: '-ol',
    exampleSmiles: 'Oc1ccccc1',
    exampleName: 'phenol',
  },
  {
    name: 'Thiol',
    suffix: '-thiol',
    exampleSmiles: 'CC(C)S',
    exampleName: 'propane-2-thiol',
  },
  {
    name: 'Ether',
    suffix: '-yl ether',
    prefix: '-oxy-',
    exampleSmiles: 'CCOC',
    exampleName: '1-methoxyethane (ethyl methyl ether)',
  },
  {
    name: 'Thioether (sulfide)',
    suffix: '-yl sulfide',
    exampleSmiles: 'CCSC',
    exampleName: 'ethyl methyl sulfide',
  },
  {
    name: 'Aldehyde',
    suffix: '-al',
    prefix: 'oxo-',
    exampleSmiles: 'CCCC=O',
    exampleName: 'butanal',
  },
  {
    name: 'Ketone',
    suffix: '-one',
    prefix: 'oxo-',
    exampleSmiles: 'CCCC(=O)C',
    exampleName: 'pentan-2-one',
  },
  {
    name: 'Hemiacetal',
    exampleSmiles: 'CCC(O)OC',
    exampleName: '1-methoxypropan-1-ol',
  },
  {
    name: 'Acetal',
    exampleSmiles: 'CCC(OC)OC',
    exampleName: '1,1-dimethoxypropane',
  },
  {
    name: 'Amine',
    suffix: '-amine',
    exampleSmiles: 'CCNC',
    exampleName: 'N-methylethanamine',
  },
  {
    name: 'Hydrazine',
    suffix: '-hydrazine',
    exampleSmiles: 'CCNN',
    exampleName: 'ethylhydrazine',
  },
  {
    name: 'Hydrazone',
    suffix: '-one hydrazone / -al hydrazone',
    exampleSmiles: 'CC=NN',
    exampleName: 'ethanal hydrazone',
  },
  {
    name: 'Imine',
    suffix: '-imine',
    exampleSmiles: 'CC(C)=N',
    exampleName: 'propan-2-imine',
  },
  {
    name: 'Nitrile',
    suffix: '-nitrile',
    prefix: 'cyano-',
    exampleSmiles: 'CCC#N',
    exampleName: 'propanenitrile (propionitrile)',
    note: 'the C of C≡N counts in the parent chain',
  },
  {
    name: 'Carboxylic acid',
    suffix: '-oic acid',
    exampleSmiles: 'CCCC(=O)O',
    exampleName: 'butanoic acid (butyric acid)',
  },
  {
    name: 'Ester',
    suffix: 'alkyl -oate',
    exampleSmiles: 'CCC(=O)OCC',
    exampleName: 'ethyl propanoate',
  },
  {
    name: 'Anhydride',
    suffix: '-oic anhydride',
    exampleSmiles: 'CC(=O)OC(=O)C',
    exampleName: 'ethanoic anhydride (acetic anhydride)',
  },
  {
    name: 'Acid halide',
    suffix: '-oyl halide',
    exampleSmiles: 'CCC(=O)Br',
    exampleName: 'propanoyl bromide',
  },
  {
    name: 'Amide',
    suffix: '-amide',
    exampleSmiles: 'CCC(=O)N(C)CC',
    exampleName: 'N-ethyl-N-methylpropanamide',
  },
];

/**
 * Seniority of functional groups when both could compete as a suffix.
 * Higher = more senior. Reads top-to-bottom in the cheatsheet column.
 */
export const SENIORITY_ORDER: string[] = [
  'Cation',
  'Carboxylic acid',
  'Anhydride',
  'Ester',
  'Acid halide',
  'Amide',
  'Nitrile',
  'Aldehyde',
  'Ketone',
  'Alcohol / Phenol',
  'Thiol',
  'Amine',
  'Imine',
  'Ether / Sulfide',
  'Alkene / Alkyne (unsaturation)',
  'Halide',
];
