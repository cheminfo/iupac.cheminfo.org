import { Callout, Card, H4 } from '@blueprintjs/core';
import { useCallback, useEffect, useState } from 'react';

import { StructureDisplay } from '../components/StructureDisplay.tsx';
import { StructureEditor } from '../components/StructureEditor.tsx';
import { STORAGE_KEYS, readJson, writeJson } from '../utils/storage.ts';

interface PlaygroundState {
  initialSmiles: string;
  /** Live idCode of the molecule currently in the editor. */
  idCode: string;
}

const DEFAULT_SMILES = 'CC(C)C(=O)OCC';

function loadPlayground(): PlaygroundState {
  const parsed = readJson(
    STORAGE_KEYS.playgroundState,
  ) as Partial<PlaygroundState> | null;
  return {
    initialSmiles: parsed?.initialSmiles ?? DEFAULT_SMILES,
    idCode: parsed?.idCode ?? '',
  };
}

/**
 * The interactive playground. The student drops in any SMILES (or draws a
 * molecule from scratch) and inspects the resulting structure plus the
 * canonical OCL idCode. No exercises, no grading — pure exploration.
 * @returns The playground page.
 */
export function Playground() {
  const [state, setState] = useState<PlaygroundState>(loadPlayground);

  useEffect(() => {
    writeJson(STORAGE_KEYS.playgroundState, state);
  }, [state]);

  const handleEditorChange = useCallback((idCode: string) => {
    setState((previous) => ({ ...previous, idCode }));
  }, []);

  return (
    <div className="section-stack">
      <Callout intent="primary" icon="info-sign">
        Drop a SMILES below to seed the editor, then redraw freely. The
        canonical idCode updates on every change — this is exactly the
        identifier used to grade <em>name-to-structure</em> exercises.
      </Callout>

      <div className="split">
        <Card elevation={1}>
          <H4>Seed structure</H4>
          <input
            className="answer-input bp6-input"
            value={state.initialSmiles}
            onChange={(event) => {
              setState((previous) => ({
                ...previous,
                initialSmiles: event.target.value,
              }));
            }}
            spellCheck={false}
            autoComplete="off"
          />
          <div className="muted" style={{ fontSize: 12, marginTop: 6 }}>
            Type any SMILES (e.g. <code>CCCC=O</code> or <code>c1ccccc1Cl</code>
            ) and the editor below resets to it.
          </div>
          <div style={{ marginTop: 12 }}>
            <StructureDisplay smiles={state.initialSmiles} />
          </div>
        </Card>

        <Card elevation={1}>
          <H4>Editor</H4>
          <StructureEditor
            initialSmiles={state.initialSmiles}
            onChange={handleEditorChange}
          />
          {state.idCode && (
            <div className="muted" style={{ fontSize: 12, marginTop: 8 }}>
              Canonical OCL idCode: <code>{state.idCode}</code>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
