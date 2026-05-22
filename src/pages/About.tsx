import { AnchorButton, Card, H4 } from '@blueprintjs/core';

const LEGACY_VIEW_URL =
  'https://www.cheminfo.org/?viewURL=https%3A%2F%2Fcouch.cheminfo.org%2Fcheminfo-public%2Fc13474e55f66984d203dd496788b1661%2Fview.json&loadversion=true&fillsearch=Iupac+nom+vers+structure';

/**
 * About page. Explains what the site is, what legacy visualizer view it
 * replaces, and points to the source.
 * @returns The about page.
 */
export function About() {
  return (
    <div className="section-stack">
      <Card elevation={1}>
        <H4>About this site</H4>
        <p>
          <strong>iupac.cheminfo.org</strong> is an interactive pedagogic tool
          to learn IUPAC organic nomenclature. It ships a guided tutorial, a
          live SMILES playground with the OpenChemLib structure editor, a
          self-paced exercises module that grades both directions (structure →
          name and name → structure), and a complete printable cheatsheet.
        </p>
        <p>
          The structure editor and SVG renderer come from{' '}
          <a
            href="https://github.com/zakodium-oss/react-ocl"
            target="_blank"
            rel="noreferrer"
          >
            react-ocl
          </a>
          ; the canonical comparison uses{' '}
          <a
            href="https://github.com/cheminfo/openchemlib-js"
            target="_blank"
            rel="noreferrer"
          >
            openchemlib
          </a>{' '}
          idCodes.
        </p>
      </Card>

      <Card elevation={1}>
        <H4>Teacher mode — share a custom series</H4>
        <p>
          Open the Exercises tab and click{' '}
          <kbd className="kbd">Share a custom series</kbd>. Choose any
          combination of difficulty, functional groups and exercise kind, then
          pick a count and a random seed. You can copy a URL that re-creates
          exactly the same exercises, in the same order, for every student who
          opens it.
        </p>
        <p>
          The seed is fed into the{' '}
          <a
            href="https://github.com/mljs/xsadd"
            target="_blank"
            rel="noreferrer"
          >
            ml-xsadd
          </a>{' '}
          PRNG so the shuffle is fully deterministic. Student progress is stored
          locally in their browser (under the canonical OCL idCode for drawing
          exercises), so a student opening the link on the same machine picks up
          where they left off.
        </p>
      </Card>

      <Card elevation={1}>
        <H4>
          Replaces the cheminfo &ldquo;IUPAC nomenclature&rdquo; visualizer
        </H4>
        <p>
          This site is the modern, standalone replacement for the legacy IUPAC
          nomenclature view embedded inside the cheminfo visualizer. It keeps
          the same exercises and adds the guided tutorial, structure editor
          integration and shareable teacher series.
        </p>
        <div
          style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}
        >
          <AnchorButton
            icon="history"
            href={LEGACY_VIEW_URL}
            target="_blank"
            rel="noreferrer"
            text="Open the legacy visualizer view"
          />
          <AnchorButton
            icon="globe"
            href="https://iupac.cheminfo.org"
            target="_blank"
            rel="noreferrer"
            text="iupac.cheminfo.org"
          />
        </div>
      </Card>

      <Card elevation={1}>
        <H4>Source and license</H4>
        <p>
          Released under the{' '}
          <a
            href="https://github.com/cheminfo/iupac.cheminfo.org/blob/main/LICENSE"
            target="_blank"
            rel="noreferrer"
          >
            MIT licence
          </a>
          . Issues, suggestions and pull requests are welcome on GitHub.
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <AnchorButton
            icon="git-repo"
            href="https://github.com/cheminfo/iupac.cheminfo.org"
            target="_blank"
            rel="noreferrer"
            text="Source on GitHub"
          />
          <AnchorButton
            icon="issue"
            href="https://github.com/cheminfo/iupac.cheminfo.org/issues"
            target="_blank"
            rel="noreferrer"
            text="Report an issue"
          />
        </div>
      </Card>
    </div>
  );
}
