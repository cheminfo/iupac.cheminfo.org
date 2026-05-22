import { Card, H4 } from '@blueprintjs/core';
import { SmilesSvgRenderer } from 'react-ocl';

import {
  FUNCTIONAL_GROUPS,
  REFERENCE_SECTIONS,
  SENIORITY_ORDER,
} from '../data/reference.ts';

/**
 * The IUPAC cheatsheet — chain lengths, naming rules, stereodescriptors,
 * common branched substituents and a functional-group table with worked
 * examples and an actual structure rendering for each group.
 * @returns The cheatsheet card stack.
 */
export function ReferencePanel() {
  return (
    <>
      <Card elevation={1} aria-label="IUPAC cheatsheet">
        <H4>Cheatsheet</H4>
        <div className="reference-grid">
          {REFERENCE_SECTIONS.map((section) => (
            <div key={section.title}>
              <H4 style={{ marginTop: 4, marginBottom: 8, color: '#0e5a91' }}>
                {section.title}
              </H4>
              <table className="reference-table">
                <tbody>
                  {section.items.map((item) => (
                    <tr key={item.syntax}>
                      <td>
                        <code>{item.syntax}</code>
                      </td>
                      <td>{item.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
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
    </>
  );
}
