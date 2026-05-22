import {
  Button,
  ButtonGroup,
  Callout,
  Card,
  Code,
  H4,
  InputGroup,
  Tag,
} from '@blueprintjs/core';
import { useMemo } from 'react';

import { buildHints } from '../iupac/hints.ts';
import type { Exercise, ExerciseState, ValidationResult } from '../types.ts';
import { KIND_LABEL, LEVEL_INTENT } from '../utils/exerciseDisplay.ts';

import { StructureDisplay } from './StructureDisplay.tsx';
import { StructureEditor } from './StructureEditor.tsx';

interface Props {
  exercise: Exercise;
  state: ExerciseState;
  validation: ValidationResult;
  onUpdate: (patch: Partial<ExerciseState>) => void;
}

/**
 * The right-hand "active exercise" column. The layout depends on the
 * exercise kind:
 *  - `structure-to-name`: the molecule is rendered as a static SVG, and
 *    the student types the name in a text input.
 *  - `name-to-structure`: the name is shown as a header, and the student
 *    draws the molecule in an OCL canvas editor.
 *
 * Hints, sample-solution reveal and per-exercise reset are shared across
 * both kinds.
 * @param props - The active exercise plus its state and validation result.
 * @param props.exercise - The exercise to render.
 * @param props.state - Persisted per-exercise state.
 * @param props.validation - Live validation against the student's answer.
 * @param props.onUpdate - Apply a partial state patch.
 * @returns The active-exercise card stack.
 */
export function ActiveExerciseCard({
  exercise,
  state,
  validation,
  onUpdate,
}: Props) {
  const hints = useMemo(() => buildHints(exercise), [exercise]);

  function check() {
    onUpdate({ status: validation.passed ? 'solved' : 'attempted' });
  }

  function revealHint() {
    if (state.hintsRevealed < hints.length) {
      onUpdate({ hintsRevealed: state.hintsRevealed + 1 });
    }
  }

  function resetExercise() {
    onUpdate({
      answerName: '',
      answerIdCode: '',
      status: 'idle',
      hintsRevealed: 0,
      showSolution: false,
    });
  }

  return (
    <div className="section-stack">
      <Card elevation={1}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Tag minimal intent={LEVEL_INTENT[exercise.level]}>
            {exercise.level}
          </Tag>
          <Tag minimal intent="primary">
            {KIND_LABEL[exercise.kind]}
          </Tag>
        </div>
        <H4 style={{ marginTop: 8 }}>
          {exercise.kind === 'structure-to-name'
            ? 'Name this structure'
            : exercise.molecule.name}
        </H4>

        {exercise.kind === 'structure-to-name' ? (
          <StructureToNameInput
            exercise={exercise}
            state={state}
            onUpdate={onUpdate}
          />
        ) : (
          <NameToStructureInput state={state} onUpdate={onUpdate} />
        )}

        <div style={{ marginTop: 12 }}>
          <ButtonGroup>
            <Button
              icon="tick-circle"
              intent="primary"
              onClick={check}
              text="Check my answer"
            />
            <Button
              icon="lightbulb"
              onClick={revealHint}
              disabled={state.hintsRevealed >= hints.length}
              text={`Reveal hint (${state.hintsRevealed}/${hints.length})`}
            />
            <Button
              icon={state.showSolution ? 'eye-off' : 'eye-open'}
              onClick={() => {
                onUpdate({ showSolution: !state.showSolution });
              }}
              text={state.showSolution ? 'Hide solution' : 'Reveal solution'}
            />
            <Button icon="refresh" onClick={resetExercise} text="Reset" />
          </ButtonGroup>
        </div>

        {state.status === 'solved' && validation.passed && (
          <Callout
            intent="success"
            icon="confirm"
            title="Brilliant! Exercise solved."
            style={{ marginTop: 12 }}
          >
            Your answer matches. Move on to the next exercise.
            {state.hintsRevealed > 0 && (
              <div style={{ marginTop: 6 }}>
                <Tag minimal intent="warning" icon="lightbulb">
                  Solved with {state.hintsRevealed} hint
                  {state.hintsRevealed > 1 ? 's' : ''}
                </Tag>
              </div>
            )}
          </Callout>
        )}
        {state.status === 'attempted' &&
          !validation.passed &&
          validation.reason && (
            <Callout
              intent="danger"
              icon="cross"
              title="Not quite yet"
              style={{ marginTop: 12 }}
            >
              {validation.reason}
            </Callout>
          )}

        {state.hintsRevealed > 0 && (
          <Callout
            intent="primary"
            icon="lightbulb"
            title="Hints"
            style={{ marginTop: 12 }}
          >
            <ol style={{ marginTop: 4, marginBottom: 0, paddingLeft: 18 }}>
              {hints.slice(0, state.hintsRevealed).map((hint) => (
                <li key={hint}>{hint}</li>
              ))}
            </ol>
          </Callout>
        )}

        {state.showSolution && (
          <Callout
            intent="warning"
            icon="key"
            title="Sample solution"
            style={{ marginTop: 12 }}
          >
            <div>
              <strong>IUPAC name:</strong> <Code>{exercise.molecule.name}</Code>
              {exercise.molecule.name2 && (
                <>
                  {' '}
                  · alternative <Code>{exercise.molecule.name2}</Code>
                </>
              )}
              {exercise.molecule.trivial && (
                <>
                  {' '}
                  · trivial <Code>{exercise.molecule.trivial}</Code>
                </>
              )}
            </div>
            <div style={{ marginTop: 6 }}>
              <strong>SMILES:</strong> <Code>{exercise.molecule.smiles}</Code>
            </div>
          </Callout>
        )}
      </Card>
    </div>
  );
}

interface NamePromptProps {
  exercise: Exercise;
  state: ExerciseState;
  onUpdate: (patch: Partial<ExerciseState>) => void;
}

function StructureToNameInput({ exercise, state, onUpdate }: NamePromptProps) {
  return (
    <>
      <StructureDisplay smiles={exercise.molecule.smiles} />
      <div style={{ marginTop: 12 }}>
        <InputGroup
          size="large"
          autoFocus
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
          className="answer-input"
          placeholder="Type the IUPAC name (e.g. butan-2-ol)…"
          value={state.answerName}
          onChange={(event) => {
            onUpdate({ answerName: event.target.value, status: 'idle' });
          }}
          data-testid="answer-name"
        />
      </div>
    </>
  );
}

interface StructurePromptProps {
  state: ExerciseState;
  onUpdate: (patch: Partial<ExerciseState>) => void;
}

function NameToStructureInput({ state, onUpdate }: StructurePromptProps) {
  return (
    <div style={{ marginTop: 12 }}>
      <StructureEditor
        onChange={(idCode) => {
          onUpdate({ answerIdCode: idCode, status: 'idle' });
        }}
      />
      <div className="muted" style={{ fontSize: 12, marginTop: 6 }}>
        Draw the molecule above. The validator uses the canonical OpenChemLib
        identifier — atom ordering and bond drawing do not matter, only the
        connectivity (and stereochemistry, where the name asks for it).
      </div>
      {state.answerIdCode && (
        <div className="muted" style={{ fontSize: 11, marginTop: 4 }}>
          current idCode: <Code>{state.answerIdCode}</Code>
        </div>
      )}
    </div>
  );
}
