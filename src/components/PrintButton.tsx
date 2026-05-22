import { Button } from '@blueprintjs/core';

/**
 * Primary "Print" button used by the cheatsheet page. Triggers the browser
 * print dialog.
 * @returns The print button.
 */
export function PrintButton() {
  return (
    <Button
      icon="print"
      intent="primary"
      onClick={() => globalThis.print()}
      text="Print"
    />
  );
}
