import { PrintButton } from '../components/PrintButton.tsx';
import { ReferencePanel } from '../components/ReferencePanel.tsx';

/**
 * The cheatsheet page. Shows the IUPAC reference plus a print button.
 * @returns The cheatsheet page.
 */
export function Cheatsheet() {
  return (
    <div className="section-stack cheatsheet-page">
      <div className="cheatsheet-toolbar no-print">
        <PrintButton />
      </div>
      <ReferencePanel />
    </div>
  );
}
