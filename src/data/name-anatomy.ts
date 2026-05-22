/**
 * Optional mini key→value list shown inside a name-part card when the
 * content is best laid out as a small mapping (e.g. bond type → suffix).
 */
export interface NamePartMapping {
  /** Left-hand label (e.g. "single"). */
  key: string;
  /** Right-hand value (e.g. "-an-"). */
  value: string;
}

/**
 * One of the five positional parts of an IUPAC name. The cheatsheet
 * displays them as columns A–E in the order they appear in the assembled
 * name.
 */
export interface NamePart {
  /** Single-letter label used on the handout (A through E). */
  letter: 'A' | 'B' | 'C' | 'D' | 'E';
  /** Short header (e.g. "Prefixes"). */
  title: string;
  /** One-sentence description of what fills this part. */
  description: string;
  /**
   * Optional mapping rendered as a stacked key→value list under the
   * description. Used for parts whose content has discrete sub-cases.
   */
  mappings?: NamePartMapping[];
  /** Short list of representative fragments for quick reference. */
  examples: string;
}

/**
 * Anatomy of an IUPAC name in the order the fragments are written.
 * Reads: `A B C D E` → `prefix(es) [cyclo] root unsat-suffix function-suffix`.
 */
export const NAME_PARTS: NamePart[] = [
  {
    letter: 'A',
    title: 'Prefixes (substituents)',
    description:
      'Substituents listed alphabetically with their locants. Multipliers (di, tri, tetra) are written but ignored when sorting.',
    examples: '2-chloro-, 3-methyl-, 1,1-dibromo-',
  },
  {
    letter: 'B',
    title: 'Infix (cyclo)',
    description: 'Present only when the parent chain is a ring.',
    examples: 'cyclo-',
  },
  {
    letter: 'C',
    title: 'Main chain (root)',
    description:
      'The longest carbon chain that carries the most senior function. Sets the base name.',
    examples: 'meth, eth, prop, but, pent, hex, hept, oct…',
  },
  {
    letter: 'D',
    title: 'Unsaturation suffix',
    description:
      'Marks the C–C bond type in the main chain. The locant precedes the suffix; the trailing "e" belongs to part E.',
    mappings: [
      { key: 'single bond', value: '-an-' },
      { key: 'double bond', value: '-en-' },
      { key: 'triple bond', value: '-yn-' },
    ],
    examples: '-an-, -2-en-, -1-yn-, -1,3-dien-',
  },
  {
    letter: 'E',
    title: 'Function suffix',
    description:
      'The most senior functional group, named as a suffix with its locant. When no function is present, a plain "e" fills the slot (the "e" of -ane, -ene, -yne).',
    mappings: [
      { key: 'no function', value: '-e' },
      { key: 'alcohol', value: '-ol' },
      { key: 'ketone', value: '-one' },
      { key: 'aldehyde', value: '-al' },
      { key: 'carboxylic acid', value: '-oic acid' },
      { key: 'amine', value: '-amine' },
    ],
    examples: 'methane, propanal, butan-2-one, hexan-1-ol',
  },
];

/**
 * A simple molecule split into the five positional parts of its IUPAC name.
 * Empty strings mean the part is not used in this molecule. Rendered in the
 * cheatsheet as a row showing the structure next to its broken-down name.
 */
export interface SimpleMoleculeExample {
  /** SMILES of the molecule, used to render a structure. */
  smiles: string;
  /** Full IUPAC name of the molecule. */
  name: string;
  /** Fragments occupying each of the five positions in the name. */
  parts: { A: string; B: string; C: string; D: string; E: string };
}

/**
 * Simple molecules chosen so each successive example introduces one more
 * part of the name (root → function → unsaturation → cyclo → prefix), making
 * the anatomy table easy to follow at a glance.
 */
export const SIMPLE_MOLECULE_EXAMPLES: SimpleMoleculeExample[] = [
  {
    smiles: 'C',
    name: 'methane',
    parts: { A: '', B: '', C: 'meth', D: '-an-', E: 'e' },
  },
  {
    smiles: 'CCO',
    name: 'ethanol',
    parts: { A: '', B: '', C: 'eth', D: '-an-', E: '-ol' },
  },
  {
    smiles: 'CC=C',
    name: 'prop-1-ene',
    parts: { A: '', B: '', C: 'prop', D: '-1-en-', E: 'e' },
  },
  {
    smiles: 'CCC=O',
    name: 'propanal',
    parts: { A: '', B: '', C: 'prop', D: '-an-', E: '-al' },
  },
  {
    smiles: 'OC1CCCCC1',
    name: 'cyclohexan-1-ol',
    parts: { A: '', B: 'cyclo', C: 'hex', D: '-an-', E: '-1-ol' },
  },
  {
    smiles: 'CC(Cl)CO',
    name: '2-chloropropan-1-ol',
    parts: { A: '2-chloro', B: '', C: 'prop', D: '-an-', E: '-1-ol' },
  },
  {
    smiles: 'OC1=CCCCC1Cl',
    name: '2-chlorocyclohex-1-en-1-ol',
    parts: { A: '2-chloro', B: 'cyclo', C: 'hex', D: '-1-en-', E: '-1-ol' },
  },
];
