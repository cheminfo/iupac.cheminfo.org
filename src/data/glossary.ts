/**
 * A single example shown inside a glossary tooltip. For nomenclature, an
 * example is usually a SMILES + the IUPAC name it resolves to.
 */
export interface GlossaryExample {
  /** SMILES of the molecule that illustrates the concept. */
  smiles: string;
  /** IUPAC name (or other text) the example resolves to. */
  name: string;
  /**
   * Short explanation of what the example demonstrates.
   * @default undefined
   */
  note?: string;
}

/**
 * Rich content rendered inside a Blueprint tooltip for a glossary term or
 * for the "Try it" help icon.
 */
export interface GlossaryEntry {
  title: string;
  summary: string;
  examples: GlossaryExample[];
}

/**
 * Keyed by the literal term used inside `[[...]]` markers in step
 * descriptions. Keys are lowercase; lookups also lowercase the marker.
 */
export const GLOSSARY: Record<string, GlossaryEntry> = {
  root: {
    title: 'Root (parent chain)',
    summary:
      'The longest carbon chain that carries the most senior functional group. The number of carbons in the root gives the base name: meth (1), eth (2), prop (3), but (4), pent (5), hex (6), hept (7), oct (8), non (9), dec (10).',
    examples: [
      {
        smiles: 'CCCCO',
        name: 'butan-1-ol',
        note: '4 carbons in the chain → "but"; suffix -ol marks the alcohol.',
      },
    ],
  },
  prefix: {
    title: 'Prefix (substituent)',
    summary:
      'A substituent reported in front of the root name with a position locant. Substituents are listed alphabetically; the multiplier (di, tri, tetra) does not count for the alphabetical order.',
    examples: [
      {
        smiles: 'CCC(C)Br',
        name: '2-bromobutane',
        note: 'bromo at position 2 of butane.',
      },
    ],
  },
  suffix: {
    title: 'Suffix (function)',
    summary:
      'The most senior functional group ends the name (e.g. -ol, -one, -al, -oic acid). Less senior groups become prefixes. Suffixes carry their own locant whenever ambiguous.',
    examples: [
      { smiles: 'CCCC(=O)O', name: 'butanoic acid', note: '-oic acid suffix.' },
      {
        smiles: 'CCC(=O)CC',
        name: 'pentan-3-one',
        note: '-one suffix with locant 3.',
      },
    ],
  },
  locant: {
    title: 'Locant (position number)',
    summary:
      'The number identifying where a substituent or functional group is attached on the parent chain. Numbering must give the senior suffix the lowest possible locant; ties are broken by giving lower locants to unsaturations, then to substituents.',
    examples: [
      {
        smiles: 'CC(O)CCO',
        name: 'butane-1,3-diol',
        note: 'Numbering from the OH that ends up with the lower set of locants.',
      },
    ],
  },
  insaturation: {
    title: 'Unsaturation suffix',
    summary:
      'A double bond replaces "-ane" with "-ene", a triple bond with "-yne". The locant of the unsaturation precedes the suffix (e.g. but-2-ene). Multiple unsaturations use multipliers (-diene, -triene) with an inserted "a" (propa-1,2-diene).',
    examples: [
      { smiles: 'CC=CC', name: 'but-2-ene' },
      { smiles: 'CC#C', name: 'prop-1-yne' },
    ],
  },
  multiplier: {
    title: 'Multiplier (di, tri, tetra…)',
    summary:
      'Used when the same substituent appears more than once. Multipliers are ignored when sorting substituents alphabetically — "dibromo" sorts under "b".',
    examples: [
      { smiles: 'BrC(Br)C(Cl)C', name: '1,1-dibromo-2-chloropropane' },
    ],
  },
  cyclo: {
    title: 'cyclo- prefix',
    summary:
      'Identifies a cyclic parent chain. Numbering starts at the carbon that gives the senior suffix (or, failing that, the substituent set) the lowest locants.',
    examples: [
      { smiles: 'C1CCCCC1', name: 'cyclohexane' },
      { smiles: 'OC1CCCCC1', name: 'cyclohexan-1-ol' },
    ],
  },
  stereochemistry: {
    title: 'Stereodescriptors (E/Z, R/S)',
    summary:
      'Capital descriptors that pin the geometry of a double bond (E/Z) or the absolute configuration of a stereocenter (R/S). Always written in parentheses with the corresponding locant in front of the root, separated by hyphens.',
    examples: [
      { smiles: 'C/C=C/C', name: '(E)-but-2-ene' },
      { smiles: 'C[C@H](Cl)CC', name: '(2R)-2-chlorobutane' },
    ],
  },
  alkyl: {
    title: 'Alkyl substituent',
    summary:
      'A carbon-only substituent named like an alkane root with the "-ane" suffix replaced by "-yl". Examples: methyl (1C), ethyl (2C), propyl (3C). Branched variants: iso-, sec-, tert-.',
    examples: [
      { smiles: 'CCC(C)CC', name: '3-methylpentane' },
      { smiles: 'CCC(CC)CC', name: '3-ethylpentane' },
    ],
  },
  phenyl: {
    title: 'Phenyl substituent',
    summary:
      'The benzene ring used as a substituent. Written "phenyl-" with the locant of the attachment carbon on the parent chain. The closely related "benzyl-" group includes one extra CH₂.',
    examples: [
      { smiles: 'c1ccccc1CC', name: 'ethylbenzene' },
      { smiles: 'CC(c1ccccc1)O', name: '1-phenylethan-1-ol' },
    ],
  },
  halogen: {
    title: 'Halogen prefix',
    summary:
      'A halogen substituent is always reported as a prefix (fluoro-, chloro-, bromo-, iodo-) with its locant; never as a suffix. Multiple halogens follow the alphabetical-order rule.',
    examples: [
      { smiles: 'ClCCBr', name: '1-bromo-2-chloroethane' },
      { smiles: 'FC(Cl)Br', name: 'bromochlorofluoromethane' },
    ],
  },
  senior: {
    title: 'Seniority of functional groups',
    summary:
      'Some functional groups can only be suffixes (carboxylic acid, ester, amide, nitrile, aldehyde, ketone, alcohol, amine — in roughly decreasing order). When two functions coexist, the more senior one becomes the suffix and the rest are demoted to prefixes (e.g. "oxo-" for a ketone, "hydroxy-" for an alcohol).',
    examples: [
      {
        smiles: 'O=CCCC(=O)O',
        name: '4-oxobutanoic acid',
        note: 'Carboxylic acid (suffix) wins over the aldehyde (prefix oxo-).',
      },
    ],
  },
  ene: {
    title: 'Carbon–carbon double bond (-ene)',
    summary:
      'Replaces "-ane" with "-ene" and carries the lowest possible locant. Geometry is specified with an (E)- or (Z)- prefix attached to the locant.',
    examples: [
      { smiles: 'C=CC', name: 'prop-1-ene' },
      { smiles: 'CC=CC=CC', name: 'hexa-2,4-diene' },
    ],
  },
};

/**
 * Static "Try it" help entry shown next to the tutorial's playground panel.
 * Kept here (rather than on the tutorial step) so the tutorial steps stay
 * focused on chemistry content.
 */
export const TRY_IT_HELP: GlossaryEntry = {
  title: 'Try it',
  summary:
    'Every tutorial step preloads a structure. Use the editor to redraw, change a substituent or modify the stereochemistry — the IUPAC name does not regenerate, so check the answer-revealing badge to see whether your edit still matches.',
  examples: [],
};
