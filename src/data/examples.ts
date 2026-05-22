/**
 * A worked IUPAC nomenclature example — a single molecule shown with its
 * canonical IUPAC name, taken from the course handout. Rendered as a card on
 * the Examples page so students can compare structure ↔ name side by side.
 */
export interface IupacExample {
  /** Stable id used as React key (slug of the IUPAC name). */
  id: string;
  /** Canonical IUPAC name as printed in the source handout. */
  name: string;
  /** SMILES used to render the 2D structure. */
  smiles: string;
  /**
   * Pedagogic group used to lay the examples out — keeps the simple
   * single-functional-group cases together and the harder multi-substituent
   * cases in their own row.
   */
  group: 'introductory' | 'advanced';
}

/**
 * Worked IUPAC nomenclature examples from the course handout — each card
 * shows the 2D structure on top and the IUPAC name underneath, mirroring the
 * layout of the printed handout.
 */
export const IUPAC_EXAMPLES: IupacExample[] = [
  {
    id: '5-methylhepta-3-5-dien-2-ol',
    name: '5-methylhepta-3,5-dien-2-ol',
    smiles: 'CC(O)C=CC(C)=CC',
    group: 'introductory',
  },
  {
    id: 'cyclohex-2-enol',
    name: 'cyclohex-2-enol',
    smiles: 'OC1C=CCCC1',
    group: 'introductory',
  },
  {
    id: '1-bromo-3-chloro-5-nitrobenzene',
    name: '1-bromo-3-chloro-5-nitrobenzene',
    smiles: 'Brc1cc(Cl)cc([N+](=O)[O-])c1',
    group: 'introductory',
  },
  {
    id: '2-ethyl-3-propylbutane-1-4-diol',
    name: '2-ethyl-3-propylbutane-1,4-diol',
    smiles: 'OCC(CC)C(CCC)CO',
    group: 'introductory',
  },
  {
    id: '6-but-3-en-1-yl-5-ethylidene-3-methylene-7-propylidenedodecane',
    name: '6-(but-3-en-1-yl)-5-ethylidene-3-methylene-7-propylidenedodecane',
    smiles: 'CCC(=C)CC(=CC)C(CCC=C)C(=CCC)CCCCC',
    group: 'advanced',
  },
  {
    id: '5-5-dibromo-3-butylhept-3-ene-2-6-diol',
    name: '5,5-dibromo-3-butylhept-3-ene-2,6-diol',
    smiles: 'CC(O)C(CCCC)=CC(Br)(Br)C(O)C',
    group: 'advanced',
  },
  {
    id: '3-3-dibromo-5-butylheptane-2-6-diol',
    name: '3,3-dibromo-5-butylheptane-2,6-diol',
    smiles: 'CC(O)C(Br)(Br)CC(CCCC)C(O)C',
    group: 'advanced',
  },
];
