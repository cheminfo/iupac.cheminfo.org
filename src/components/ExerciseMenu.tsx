import { Button, Icon, Tag } from '@blueprintjs/core';
import { MF } from 'react-mf';

import type { Exercise } from '../types.ts';
import {
  KIND_LABEL,
  LEVEL_INTENT,
  STATUS_DISPLAY,
} from '../utils/exerciseDisplay.ts';
import type { StateMap } from '../utils/exerciseState.ts';

interface Props {
  exercises: readonly Exercise[];
  activeId: string;
  statesByExercise: StateMap;
  onSelect: (id: string) => void;
}

/**
 * Left-rail list of exercises with status icon, level / kind tags and a
 * hint counter. The active entry is rendered with the solid Blueprint
 * button variant; others use the outlined variant.
 * @param props - List, active id, persisted states and selection callback.
 * @param props.exercises - Every exercise to list.
 * @param props.activeId - Id of the exercise currently being worked on.
 * @param props.statesByExercise - Per-exercise persisted state.
 * @param props.onSelect - Called with the id of the newly-selected exercise.
 * @returns The exercise menu.
 */
export function ExerciseMenu({
  exercises,
  activeId,
  statesByExercise,
  onSelect,
}: Props) {
  return (
    <div className="exercise-menu" role="navigation" aria-label="Exercises">
      {exercises.map((exercise) => {
        const stored = statesByExercise[exercise.id];
        const status = stored?.status ?? 'idle';
        const hintsRevealed = stored?.hintsRevealed ?? 0;
        const isActive = exercise.id === activeId;
        const display = STATUS_DISPLAY[status];
        const isSolved = status === 'solved';
        const kindLabel = KIND_LABEL[exercise.kind];

        return (
          <Button
            key={exercise.id}
            data-testid="exercise-button"
            active={isActive}
            variant={isActive ? 'solid' : 'outlined'}
            onClick={() => {
              onSelect(exercise.id);
            }}
            alignText="left"
            className={display.className}
          >
            <div className="ex-meta">
              <Icon icon={display.icon} intent={display.intent} />
              <div className="ex-body">
                <span className="ex-title">
                  {exercise.kind === 'structure-to-name' ? (
                    <MF mf={exercise.molecule.mf} />
                  ) : (
                    exercise.title
                  )}
                </span>
                <div className="ex-tags">
                  <Tag minimal intent={LEVEL_INTENT[exercise.level]}>
                    {exercise.level}
                  </Tag>
                  <Tag minimal intent="primary">
                    {kindLabel}
                  </Tag>
                  {isSolved && (
                    <Tag minimal intent="success" icon="tick">
                      solved
                    </Tag>
                  )}
                  {hintsRevealed > 0 && (
                    <Tag
                      minimal
                      intent="warning"
                      icon="lightbulb"
                      title={
                        isSolved
                          ? `Solved with ${hintsRevealed} hint${hintsRevealed > 1 ? 's' : ''}`
                          : `${hintsRevealed} hint${hintsRevealed > 1 ? 's' : ''} revealed`
                      }
                    >
                      {hintsRevealed}
                    </Tag>
                  )}
                </div>
              </div>
            </div>
          </Button>
        );
      })}
    </div>
  );
}
