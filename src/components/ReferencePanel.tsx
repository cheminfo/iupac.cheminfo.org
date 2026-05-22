import { Card, H4, Icon } from '@blueprintjs/core';
import { Molecule } from 'openchemlib';
import { useMemo } from 'react';
import { MF } from 'react-mf';
import { SmilesSvgRenderer, SvgRenderer } from 'react-ocl';

import { NAME_PARTS, SIMPLE_MOLECULE_EXAMPLES } from '../data/name-anatomy.ts';
import { NAMING_RULES } from '../data/naming-rules.ts';
import type { ReferenceItem } from '../data/reference.ts';
import {
  BRANCHED_SUBSTITUENTS,
  CHAIN_LENGTHS,
  FUNCTIONAL_GROUPS,
  SENIORITY_ORDER,
  STEREODESCRIPTORS,
} from '../data/reference.ts';

const PART_LETTERS = ['A', 'B', 'C', 'D', 'E'] as const;

/**
 * Render a SMILES that uses `*` as the R-group attachment point, labelling
 * every wildcard atom as "R" so the rendered SVG shows an R substituent
 * rather than the plain `*` wildcard symbol.
 * @param props - Component props.
 * @param props.smiles - SMILES string with `*` as the R-group attachment.
 * @param props.width - SVG width in pixels.
 * @param props.height - SVG height in pixels.
 * @returns The R-group-labelled structure SVG.
 */
function RGroupStructure({
  smiles,
  width,
  height,
}: {
  smiles: string;
  width: number;
  height: number;
}) {
  const molecule = useMemo(() => {
    const mol = Molecule.fromSmiles(smiles);
    for (let atom = 0; atom < mol.getAllAtoms(); atom++) {
      if (mol.getAtomicNo(atom) === 0) {
        mol.setAtomCustomLabel(atom, 'R');
      }
    }
    return mol;
  }, [smiles]);
  return <SvgRenderer molecule={molecule} width={width} height={height} />;
}

/**
 * Render a molecule and overlay IUPAC locants on the requested atoms.
 * Locants are set via OCL custom labels using the `]N` prefix, which shows
 * the number as a small superscript at the top-left of the atom position
 * without replacing the underlying atom symbol.
 * @param props - Component props.
 * @param props.smiles - SMILES to render.
 * @param props.numbering - Map from atom index to locant number to display.
 * @param props.width - SVG width in pixels.
 * @param props.height - SVG height in pixels.
 * @returns The structure SVG with locants drawn next to the relevant atoms.
 */
function NumberedStructure({
  smiles,
  numbering,
  width,
  height,
}: {
  smiles: string;
  numbering: Record<number, number>;
  width: number;
  height: number;
}) {
  const molecule = useMemo(() => {
    const mol = Molecule.fromSmiles(smiles);
    for (const [atomIndex, locant] of Object.entries(numbering)) {
      mol.setAtomCustomLabel(Number(atomIndex), `]${locant}`);
    }
    return mol;
  }, [smiles, numbering]);
  return (
    <SvgRenderer
      molecule={molecule}
      width={width}
      height={height}
      factorTextSize={1.1}
      noCarbonLabelWithCustomLabel
    />
  );
}

/**
 * Two-column reference table used for chain lengths and stereodescriptors.
 * @param props - Component props.
 * @param props.items - Rows to render.
 * @returns The reference table.
 */
function ReferenceTable({ items }: { items: ReferenceItem[] }) {
  return (
    <table className="reference-table">
      <tbody>
        {items.map((item) => (
          <tr key={item.syntax}>
            <td>
              <code>{item.syntax}</code>
            </td>
            <td>{item.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/**
 * The IUPAC cheatsheet — starts with the anatomy of a name and a series of
 * simple molecules, then progresses to chain lengths, branched substituents,
 * functional groups, the nine numbering rules (each shown with an example
 * and a counter-example), and finally the stereodescriptors and seniority
 * tables.
 * @returns The cheatsheet card stack.
 */
export function ReferencePanel() {
  return (
    <>
      <Card elevation={1} aria-label="Anatomy of an IUPAC name">
        <H4>Anatomy of an IUPAC name</H4>
        <p className="muted" style={{ marginTop: 0 }}>
          A name reads as five parts in fixed order: A B C D E.
        </p>
        <div className="anatomy-parts">
          {NAME_PARTS.map((part) => (
            <div key={part.letter} className="anatomy-part">
              <div className="anatomy-part-letter">{part.letter}</div>
              <div className="anatomy-part-body">
                <div className="anatomy-part-title">{part.title}</div>
                <div className="anatomy-part-description">
                  {part.description}
                </div>
                {part.mappings ? (
                  <dl className="anatomy-part-mappings">
                    {part.mappings.map((mapping) => (
                      <div
                        key={mapping.key}
                        className="anatomy-part-mapping-row"
                      >
                        <dt>{mapping.key}</dt>
                        <dd>
                          <code>{mapping.value}</code>
                        </dd>
                      </div>
                    ))}
                  </dl>
                ) : null}
                <div className="anatomy-part-examples">
                  <code>{part.examples}</code>
                </div>
              </div>
            </div>
          ))}
        </div>

        <H4 style={{ marginTop: 18, color: '#0e5a91' }}>
          Simple molecules, part by part
        </H4>
        <div className="anatomy-table-wrapper">
          <table className="anatomy-table">
            <thead>
              <tr>
                <th>Structure</th>
                {PART_LETTERS.map((letter) => (
                  <th key={letter}>{letter}</th>
                ))}
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {SIMPLE_MOLECULE_EXAMPLES.map((example) => (
                <tr key={example.name}>
                  <td className="anatomy-structure">
                    <SmilesSvgRenderer
                      smiles={example.smiles}
                      width={120}
                      height={80}
                    />
                  </td>
                  {PART_LETTERS.map((letter) => (
                    <td key={letter} className="anatomy-part-cell">
                      {example.parts[letter] ? (
                        <code>{example.parts[letter]}</code>
                      ) : (
                        <span className="muted">—</span>
                      )}
                    </td>
                  ))}
                  <td className="anatomy-name">
                    <code>{example.name}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card elevation={1} aria-label="Chain length">
        <H4>Chain length</H4>
        <div className="reference-grid">
          <ReferenceTable items={CHAIN_LENGTHS} />
        </div>
      </Card>

      <Card elevation={1} aria-label="Common branched substituents">
        <H4>Common branched substituents</H4>
        <div className="branched-grid">
          {BRANCHED_SUBSTITUENTS.map((substituent) => (
            <div key={substituent.name} className="branched-card">
              <h4>
                {substituent.name}
                {substituent.altName ? (
                  <span className="branched-card-alt">
                    {' '}
                    ({substituent.altName})
                  </span>
                ) : null}
              </h4>
              <div className="branched-card-formula">
                <MF mf={substituent.formula} />
              </div>
              <RGroupStructure
                smiles={substituent.smiles}
                width={180}
                height={100}
              />
              <div className="branched-card-systematic">
                <code>{substituent.systematic}</code>
              </div>
              {substituent.note ? (
                <div className="branched-card-note muted">
                  {substituent.note}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </Card>

      <Card elevation={1} aria-label="Functional groups">
        <H4>Functional groups</H4>
        <div className="functional-grid">
          {FUNCTIONAL_GROUPS.map((group) => (
            <div key={group.name} className="functional-card">
              <h4>{group.name}</h4>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {group.suffix && (
                  <span className="functional-card-suffix">
                    suffix: {group.suffix}
                  </span>
                )}
                {group.prefix && (
                  <span className="functional-card-suffix">
                    prefix: {group.prefix}
                  </span>
                )}
              </div>
              <div style={{ marginTop: 10 }}>
                <SmilesSvgRenderer
                  smiles={group.exampleSmiles}
                  width={220}
                  height={120}
                />
              </div>
              <div className="functional-card-example">
                <code>{group.exampleName}</code>
              </div>
              {group.note && (
                <div className="functional-card-example muted">
                  {group.note}
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      <Card elevation={1} aria-label="Naming rules">
        <H4>Naming rules (in order of application)</H4>
        <div className="naming-rules">
          {NAMING_RULES.map((rule) => (
            <div key={rule.number} className="naming-rule">
              <div className="naming-rule-header">
                <span className="naming-rule-number">Rule {rule.number}</span>
                <span className="naming-rule-description">
                  {rule.description}
                </span>
              </div>
              <div className="naming-rule-examples">
                <div className="naming-rule-example naming-rule-good">
                  <div className="naming-rule-tag">
                    <Icon icon="tick" size={12} /> Example
                  </div>
                  {rule.good.smiles ? (
                    rule.good.numbering ? (
                      <NumberedStructure
                        smiles={rule.good.smiles}
                        numbering={rule.good.numbering}
                        width={200}
                        height={120}
                      />
                    ) : (
                      <SmilesSvgRenderer
                        smiles={rule.good.smiles}
                        width={180}
                        height={100}
                      />
                    )
                  ) : null}
                  <code>{rule.good.name}</code>
                  <div className="naming-rule-note">{rule.good.note}</div>
                </div>
                <div className="naming-rule-example naming-rule-bad">
                  <div className="naming-rule-tag">
                    <Icon icon="cross" size={12} /> Counter-example
                  </div>
                  {rule.bad.smiles ? (
                    rule.bad.numbering ? (
                      <NumberedStructure
                        smiles={rule.bad.smiles}
                        numbering={rule.bad.numbering}
                        width={200}
                        height={120}
                      />
                    ) : (
                      <SmilesSvgRenderer
                        smiles={rule.bad.smiles}
                        width={180}
                        height={100}
                      />
                    )
                  ) : null}
                  <code>{rule.bad.name}</code>
                  <div className="naming-rule-note">{rule.bad.note}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card elevation={1} aria-label="Stereodescriptors and seniority">
        <H4>Stereodescriptors &amp; seniority</H4>
        <div className="reference-grid">
          <div>
            <H4 style={{ marginTop: 4, marginBottom: 8, color: '#0e5a91' }}>
              Stereodescriptors
            </H4>
            <ReferenceTable items={STEREODESCRIPTORS} />
          </div>
          <div>
            <H4 style={{ marginTop: 4, marginBottom: 8, color: '#0e5a91' }}>
              Seniority (suffix wins, prefix loses)
            </H4>
            <ol style={{ paddingLeft: 20, margin: 0 }}>
              {SENIORITY_ORDER.map((entry) => (
                <li key={entry}>{entry}</li>
              ))}
            </ol>
          </div>
        </div>
      </Card>
    </>
  );
}
