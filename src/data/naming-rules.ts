/**
 * One side of a worked example — either the correct application of a rule
 * or a common mistake it prevents.
 */
export interface NamingRuleExample {
  /** Name as written in this example (right for `good`, wrong for `bad`). */
  name: string;
  /** Optional SMILES used to render a structure next to the name. */
  smiles?: string;
  /**
   * Optional locants to overlay on the structure: map from SMILES atom index
   * (in parse order) to the IUPAC locant to display at that atom. Only the
   * main-chain atoms for this particular reading should be included.
   */
  numbering?: Record<number, number>;
  /** Short note explaining what makes this right or wrong. */
  note: string;
}

/**
 * One of the nine IUPAC numbering / ordering rules, each paired with a
 * correct application and a common mistake the rule prevents.
 */
export interface NamingRule {
  /** Rule number from the IUPAC course handout. */
  number: number;
  /** One-sentence description of the rule. */
  description: string;
  /** Correct application of the rule. */
  good: NamingRuleExample;
  /** Common mistake the rule prevents. */
  bad: NamingRuleExample;
}

/**
 * The nine rules read top-to-bottom: each row is independent and carries
 * its own structure + counter-example so the rule is self-contained.
 */
export const NAMING_RULES: NamingRule[] = [
  {
    number: 1,
    description:
      'Pick the longest carbon chain that carries the most suffix functions — that is the root.',
    good: {
      smiles: 'CCCCC(C)CC',
      name: '3-methylheptane',
      numbering: { 7: 1, 6: 2, 4: 3, 3: 4, 2: 5, 1: 6, 0: 7 },
      note: 'Longest chain is 7 carbons → heptane; the methyl is a substituent on C3.',
    },
    bad: {
      smiles: 'CCCCC(C)CC',
      name: '2-ethylhexane',
      numbering: { 5: 1, 4: 2, 3: 3, 2: 4, 1: 5, 0: 6 },
      note: 'Same molecule, but reading the chain as 6 carbons hides the longer 7-carbon path.',
    },
  },
  {
    number: 2,
    description:
      'When two chains are equally long, pick the one with the most unsaturations.',
    good: {
      smiles: 'C=CC(CC)CC',
      name: '3-ethylpent-1-ene',
      numbering: { 0: 1, 1: 2, 2: 3, 5: 4, 6: 5 },
      note: 'Both 5-carbon chains qualify; the one containing the C=C is chosen.',
    },
    bad: {
      smiles: 'C=CC(CC)CC',
      name: '3-vinylpentane',
      numbering: { 4: 1, 3: 2, 2: 3, 5: 4, 6: 5 },
      note: 'Saturated branch picked as the root, hiding the double bond inside a "vinyl" substituent.',
    },
  },
  {
    number: 3,
    description: 'Number the chain so the senior suffix has the lowest locant.',
    good: {
      smiles: 'CCCC(O)C',
      name: 'pentan-2-ol',
      numbering: { 5: 1, 3: 2, 2: 3, 1: 4, 0: 5 },
      note: 'Numbered from the OH end → suffix locant 2.',
    },
    bad: {
      smiles: 'CCCC(O)C',
      name: 'pentan-4-ol',
      numbering: { 0: 1, 1: 2, 2: 3, 3: 4, 5: 5 },
      note: 'Numbered from the wrong end → suffix locant unnecessarily high (4).',
    },
  },
  {
    number: 4,
    description:
      'When the suffix locant ties, give the lowest locant to the unsaturation.',
    good: {
      smiles: 'C=CC(O)CC',
      name: 'pent-1-en-3-ol',
      numbering: { 0: 1, 1: 2, 2: 3, 4: 4, 5: 5 },
      note: 'OH locked at C3 either way; the double bond gets the lower locant (1).',
    },
    bad: {
      smiles: 'C=CC(O)CC',
      name: 'pent-4-en-3-ol',
      numbering: { 5: 1, 4: 2, 2: 3, 1: 4, 0: 5 },
      note: 'Same molecule, but the double bond gets the higher locant (4).',
    },
  },
  {
    number: 5,
    description:
      'List substituents alphabetically before the root. Multipliers (di-, tri-…) are not counted.',
    good: {
      smiles: 'BrCC(Cl)CC',
      name: '1-bromo-2-chlorobutane',
      numbering: { 1: 1, 2: 2, 4: 3, 5: 4 },
      note: '"bromo" (b) comes before "chloro" (c).',
    },
    bad: {
      name: '2-chloro-1-bromobutane',
      note: 'Wrong: substituents are written in the wrong alphabetical order.',
    },
  },
  {
    number: 6,
    description:
      'Pick the locant set giving the lowest first-different number (compare term by term).',
    good: {
      smiles: 'ClC(Cl)CCCC',
      name: '1,1-dichloropentane',
      numbering: { 1: 1, 3: 2, 4: 3, 5: 4, 6: 5 },
      note: 'Locant set (1,1) beats (5,5) — first locant is smaller.',
    },
    bad: {
      smiles: 'ClC(Cl)CCCC',
      name: '5,5-dichloropentane',
      numbering: { 6: 1, 5: 2, 4: 3, 3: 4, 1: 5 },
      note: 'Same molecule, but numbered from the wrong end.',
    },
  },
  {
    number: 7,
    description:
      'Repeated substituents use di-, tri-, tetra-… These multipliers do not affect alphabetical order.',
    good: {
      smiles: 'BrC(Br)C(Cl)C',
      name: '1,1-dibromo-2-chloropropane',
      numbering: { 1: 1, 3: 2, 5: 3 },
      note: 'Alphabetical order set by "bromo" vs "chloro" — "di" is ignored.',
    },
    bad: {
      name: '2-chloro-1,1-dibromopropane',
      note: 'Wrong: "dibromo" sorted under "d" instead of using just "bromo".',
    },
  },
  {
    number: 8,
    description:
      'Insert an "a" or "e" before a suffix that would otherwise create two consonants in a row.',
    good: {
      smiles: 'OCCCCO',
      name: 'butane-1,4-diol',
      numbering: { 1: 1, 2: 2, 3: 3, 4: 4 },
      note: 'Keep the "e" of butane before "-diol" to separate the consonants.',
    },
    bad: {
      name: 'butan-1,4-diol',
      note: 'Wrong: "butan" + "diol" jams "n" against "d".',
    },
  },
  {
    number: 9,
    description:
      'Branched groups can use iso-, sec-, tert-. sec- and tert- are written in parentheses and do not count alphabetically; iso- does.',
    good: {
      smiles: 'CC(C)CCCBr',
      name: '1-bromo-4-methylpentane',
      numbering: { 5: 1, 4: 2, 3: 3, 1: 4, 0: 5 },
      note: 'Systematic name — preferred over "isohexyl bromide".',
    },
    bad: {
      name: '4-(sec-butyl)-2-(tert-butyl)hexane',
      note: 'If both prefixes were sorted by their first letter ("s", "t"), the order would be wrong — sec- and tert- are ignored, so the actual root letter ("b") decides.',
    },
  },
];
