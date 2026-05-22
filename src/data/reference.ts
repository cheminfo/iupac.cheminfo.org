/**
 * One row in a simple two-column reference table — left cell holds a
 * short syntax fragment, right cell its description.
 */
export interface ReferenceItem {
  /** Token shown in the left cell of the table. */
  syntax: string;
  /** Short description shown in the right cell. */
  description: string;
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
 * Stereodescriptors as a flat reference table — pushed to the end of the
 * cheatsheet because they only matter once the basics are settled.
 */
export const STEREODESCRIPTORS: ReferenceItem[] = [
  { syntax: '(E)- / (Z)-', description: 'double-bond geometry (CIP rules)' },
  {
    syntax: '(R)- / (S)-',
    description: 'absolute configuration of a stereocenter',
  },
  { syntax: 'cis- / trans-', description: 'relative on a ring (older form)' },
  {
    syntax: 'erythro / threo',
    description: 'relative two-center descriptors (historical)',
  },
];

/**
 * A branched / unsaturated substituent shown in the cheatsheet — common name,
 * formula (rendered via react-mf for proper subscripts), systematic IUPAC
 * name, and a SMILES with `*` as the R-group attachment point so a structure
 * can be drawn with an R label on the connecting bond.
 */
export interface BranchedSubstituent {
  /** Common / trivial name (e.g. "isopropyl"). */
  name: string;
  /** Alternate common name in parentheses, when applicable (e.g. "isoamyl"). */
  altName?: string;
  /** Molecular formula in the `react-mf` input string format, with R for the attachment. */
  formula: string;
  /** Systematic IUPAC name (e.g. "propan-2-yl"). */
  systematic: string;
  /** SMILES using `*` as the R-group attachment point. */
  smiles: string;
  /** Short note (e.g. alphabetical-counting quirks). */
  note?: string;
}

/**
 * Branched / unsaturated common substituents, with R-group structures, taken
 * from the IUPAC organic-nomenclature course handout.
 */
export const BRANCHED_SUBSTITUENTS: BranchedSubstituent[] = [
  {
    name: 'isopropyl',
    formula: '(CH3)2CHR',
    systematic: 'propan-2-yl',
    smiles: '*C(C)C',
  },
  {
    name: 'isobutyl',
    formula: '(CH3)2CHCH2R',
    systematic: '2-methylpropyl',
    smiles: '*CC(C)C',
  },
  {
    name: 'sec-butyl',
    formula: 'CH3CH2CH(CH3)R',
    systematic: 'butan-2-yl',
    smiles: '*C(C)CC',
    note: 'counts alphabetically as "b"',
  },
  {
    name: 'tert-butyl',
    formula: '(CH3)3CR',
    systematic: '2-methylpropan-2-yl',
    smiles: '*C(C)(C)C',
    note: 'counts alphabetically as "b"',
  },
  {
    name: 'isopentyl',
    altName: 'isoamyl',
    formula: '(CH3)2CHCH2CH2R',
    systematic: '3-methylbutyl',
    smiles: '*CCC(C)C',
  },
  {
    name: 'neopentyl',
    formula: '(CH3)3CCH2R',
    systematic: '2,2-dimethylpropyl',
    smiles: '*CC(C)(C)C',
  },
  {
    name: 'tert-pentyl',
    altName: 'tert-amyl',
    formula: 'CH3CH2C(CH3)2R',
    systematic: '2-methylbutan-2-yl',
    smiles: '*C(C)(C)CC',
    note: 'counts alphabetically as "p"',
  },
  {
    name: 'phenyl',
    formula: 'C6H5R',
    systematic: 'phenyl',
    smiles: '*c1ccccc1',
    note: 'benzene as substituent',
  },
  {
    name: 'benzyl',
    formula: 'C6H5CH2R',
    systematic: 'phenylmethyl',
    smiles: '*Cc1ccccc1',
  },
  {
    name: 'vinyl',
    formula: 'CH2=CHR',
    systematic: 'ethenyl',
    smiles: '*C=C',
  },
  {
    name: 'allyl',
    formula: 'CH2=CHCH2R',
    systematic: 'prop-2-en-1-yl',
    smiles: '*CC=C',
  },
  {
    name: 'isopropenyl',
    formula: 'CH2=C(CH3)R',
    systematic: 'prop-1-en-2-yl',
    smiles: '*C(=C)C',
  },
  {
    name: 'propargyl',
    formula: 'HC#CCH2R',
    systematic: 'prop-2-yn-1-yl',
    smiles: '*CC#C',
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
