import {
  Alert,
  Button,
  Callout,
  Card,
  H4,
  ProgressBar,
  Tag,
} from '@blueprintjs/core';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { ActiveExerciseCard } from '../components/ActiveExerciseCard.tsx';
import { ExerciseMenu } from '../components/ExerciseMenu.tsx';
import { ShareSeriesDialog } from '../components/ShareSeriesDialog.tsx';
import { EXERCISES, findExercise } from '../iupac/exercises.ts';
import type { SeriesSpec } from '../iupac/series.ts';
import { resolveSeries } from '../iupac/series.ts';
import { validateExercise } from '../iupac/validate.ts';
import type { Exercise, ExerciseState } from '../types.ts';
import type { StateMap } from '../utils/exerciseState.ts';
import {
  defaultState,
  loadState,
  readExerciseIdFromHash,
  readLastExerciseId,
  saveState,
  writeLastExerciseId,
} from '../utils/exerciseState.ts';

interface Props {
  /**
   * Custom series resolved from the `?series=…` URL parameter. When set,
   * the exercise menu is restricted to this list (and the catalogue is
   * shown below as "additional exercises").
   */
  seriesSpec: SeriesSpec | null;
}

const FIRST_EXERCISE: Exercise | undefined = EXERCISES[0];

/**
 * The exercises page. Renders the list of challenges on the left and the
 * active exercise on the right. Progress lives in `localStorage`; the
 * `?series=…` URL param can replace the catalogue with a teacher-curated
 * subset.
 * @param props - The optional series spec.
 * @param props.seriesSpec - Teacher-shared series, or `null` for the full catalogue.
 * @returns The exercises page.
 */
export function Exercises({ seriesSpec }: Props) {
  const activeExercises = useMemo<readonly Exercise[]>(() => {
    if (!seriesSpec) return EXERCISES;
    const resolved = resolveSeries(seriesSpec);
    return resolved.length === 0 ? EXERCISES : resolved;
  }, [seriesSpec]);

  const firstActive = activeExercises[0] ?? FIRST_EXERCISE;

  const [activeId, setActiveIdState] = useState<string>(() => {
    const fromHash = readExerciseIdFromHash(globalThis.location.hash);
    const fromStorage = readLastExerciseId();
    const inActive = (id: string | null) =>
      id !== null && activeExercises.some((exercise) => exercise.id === id);
    const id = inActive(fromHash)
      ? fromHash
      : inActive(fromStorage)
        ? fromStorage
        : firstActive?.id;
    if (id) writeLastExerciseId(id);
    return id ?? '';
  });

  const [statesByExercise, setStatesByExercise] = useState<StateMap>(loadState);
  const [clearAlertOpen, setClearAlertOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(() => {
    saveState(statesByExercise);
  }, [statesByExercise]);

  useEffect(() => {
    function onHashChange() {
      const fromHash = readExerciseIdFromHash(globalThis.location.hash);
      if (fromHash && activeExercises.some((entry) => entry.id === fromHash)) {
        setActiveIdState(fromHash);
        writeLastExerciseId(fromHash);
      }
    }
    globalThis.addEventListener('hashchange', onHashChange);
    return () => {
      globalThis.removeEventListener('hashchange', onHashChange);
    };
  }, [activeExercises]);

  const exercise = findExercise(activeId) ?? firstActive;
  const exerciseId = exercise?.id ?? '';
  const state = statesByExercise[exerciseId] ?? defaultState();

  const selectExercise = useCallback((id: string) => {
    setActiveIdState(id);
    writeLastExerciseId(id);
    globalThis.history.pushState(
      null,
      '',
      `#/exercises/${encodeURIComponent(id)}`,
    );
  }, []);

  const updateState = useCallback(
    (patch: Partial<ExerciseState>) => {
      if (!exerciseId) return;
      setStatesByExercise((prev) => ({
        ...prev,
        [exerciseId]: {
          ...(prev[exerciseId] ?? defaultState()),
          ...patch,
        },
      }));
    },
    [exerciseId],
  );

  const answerForValidation = exercise
    ? exercise.kind === 'structure-to-name'
      ? state.answerName
      : state.answerIdCode
    : '';

  const validation = useMemo(() => {
    if (!exercise) return { passed: false, error: null, reason: null };
    return validateExercise(exercise, answerForValidation);
  }, [exercise, answerForValidation]);

  useEffect(() => {
    if (validation.passed && state.status !== 'solved') {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: auto-mark solved when the answer matches.
      updateState({ status: 'solved' });
    }
  }, [validation.passed, state.status, updateState]);

  const solvedCount = activeExercises.filter(
    (entry) => statesByExercise[entry.id]?.status === 'solved',
  ).length;
  const progress = solvedCount / activeExercises.length;

  if (!exercise) {
    return <Card>No exercises available.</Card>;
  }

  function clearAllAnswers() {
    setStatesByExercise({});
    setClearAlertOpen(false);
  }

  return (
    <div className="section-stack">
      {seriesSpec && (
        <Callout
          intent="primary"
          icon="bookmark"
          title={seriesSpec.title ?? 'Custom series'}
        >
          You are working on a shared series of {activeExercises.length}{' '}
          exercises. <Tag minimal>seed {seriesSpec.seed ?? 'unset'}</Tag>{' '}
          <a href="./">Open the full catalogue</a> to revert.
        </Callout>
      )}

      <Card elevation={1}>
        <div className="exercise-progress-header">
          <H4 style={{ margin: 0 }}>Progress</H4>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button
              icon="share"
              variant="outlined"
              text="Share a custom series"
              onClick={() => {
                setShareOpen(true);
              }}
            />
            <Button
              icon="trash"
              variant="minimal"
              intent="danger"
              onClick={() => {
                setClearAlertOpen(true);
              }}
              disabled={Object.keys(statesByExercise).length === 0}
              text="Clear all answers"
            />
          </div>
        </div>
        <ProgressBar
          value={progress}
          intent="primary"
          animate={solvedCount < activeExercises.length}
          stripes={false}
        />
        <div className="exercise-progress-summary muted">
          <span>
            {solvedCount} / {activeExercises.length} exercises solved
          </span>
          <span>{Math.round(progress * 100)}%</span>
        </div>
      </Card>

      <Alert
        isOpen={clearAlertOpen}
        intent="danger"
        icon="trash"
        confirmButtonText="Clear all answers"
        cancelButtonText="Cancel"
        onCancel={() => {
          setClearAlertOpen(false);
        }}
        onConfirm={clearAllAnswers}
      >
        <p>
          This will permanently erase your saved progress on every exercise.
          This action cannot be undone.
        </p>
      </Alert>

      <ShareSeriesDialog
        isOpen={shareOpen}
        onClose={() => {
          setShareOpen(false);
        }}
      />

      <div className="exercise-list">
        <ExerciseMenu
          exercises={activeExercises}
          activeId={exercise.id}
          statesByExercise={statesByExercise}
          onSelect={selectExercise}
        />

        <ActiveExerciseCard
          exercise={exercise}
          state={state}
          validation={validation}
          onUpdate={updateState}
        />
      </div>
    </div>
  );
}
