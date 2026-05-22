import { Card, H4 } from '@blueprintjs/core';
import { SmilesSvgRenderer } from 'react-ocl';

import { PrintButton } from '../components/PrintButton.tsx';
import { IUPAC_EXAMPLES } from '../data/examples.ts';

const GROUP_LABELS: Record<string, string> = {
  introductory: 'Introductory',
  advanced: 'Multi-substituent',
};

/**
 * Worked IUPAC nomenclature examples from the course handout. Each card
 * shows the 2D structure rendered from SMILES and the canonical IUPAC name
 * below, grouped by difficulty so the printable layout mirrors the handout.
 * @returns The Examples page.
 */
export function Examples() {
  const groups = ['introductory', 'advanced'] as const;

  return (
    <div className="section-stack examples-page">
      <div className="cheatsheet-toolbar no-print">
        <PrintButton />
      </div>

      {groups.map((group) => {
        const items = IUPAC_EXAMPLES.filter(
          (example) => example.group === group,
        );
        if (items.length === 0) return null;
        return (
          <Card key={group} elevation={1} aria-label={GROUP_LABELS[group]}>
            <H4>{GROUP_LABELS[group]} examples</H4>
            <div className="examples-grid">
              {items.map((example) => (
                <div key={example.id} className="example-card">
                  <div className="example-card-structure">
                    <SmilesSvgRenderer
                      smiles={example.smiles}
                      width={260}
                      height={160}
                    />
                  </div>
                  <div className="example-card-name">{example.name}</div>
                </div>
              ))}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
