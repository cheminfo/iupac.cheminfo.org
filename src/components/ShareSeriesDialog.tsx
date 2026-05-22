import {
  Button,
  Callout,
  Code,
  Dialog,
  DialogBody,
  DialogFooter,
  InputGroup,
  NumericInput,
  Tag,
} from '@blueprintjs/core';
import { useMemo, useState } from 'react';

import type { FunctionalKey } from '../data/molecules.ts';
import { EXERCISES } from '../iupac/exercises.ts';
import type { SeriesSpec } from '../iupac/series.ts';
import { encodeSeriesParam, resolveSeries } from '../iupac/series.ts';
import type { ExerciseKind, ExerciseLevel } from '../types.ts';
import {
  KIND_LABEL,
  LEVEL_INTENT,
  TAG_LABEL,
} from '../utils/exerciseDisplay.ts';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ALL_LEVELS: ExerciseLevel[] = ['beginner', 'intermediate', 'advanced'];
const ALL_KINDS: ExerciseKind[] = ['name-to-structure', 'structure-to-name'];

const TAG_CHOICES: FunctionalKey[] = [
  'alcane',
  'alcene',
  'alcyne',
  'aromatic',
  'cyclo',
  'alcohol',
  'phenol' as FunctionalKey, // not in source but kept stable
  'thiol',
  'ether',
  'aldehyde',
  'ketone',
  'carboxylicAcid',
  'ester',
  'anhydride',
  'amide',
  'amine',
  'imine',
  'nitrile',
  'halogen',
  'stereochemistry',
  'heterocyclic',
].filter((tag): tag is FunctionalKey => tag in TAG_LABEL);

/**
 * Dialog that lets a teacher craft a custom series of exercises and copy
 * the shareable URL. The teacher chooses kinds, levels, tags, a count and
 * an optional seed; we resolve a preview list and emit a `?series=…` URL.
 * @param props - Open state and close callback.
 * @param props.isOpen - Whether the dialog is currently visible.
 * @param props.onClose - Called when the user dismisses the dialog.
 * @returns The dialog component.
 */
export function ShareSeriesDialog({ isOpen, onClose }: Props) {
  const [title, setTitle] = useState('');
  const [kinds, setKinds] = useState<ExerciseKind[]>(['structure-to-name']);
  const [levels, setLevels] = useState<ExerciseLevel[]>(['beginner']);
  const [tags, setTags] = useState<FunctionalKey[]>([]);
  const [count, setCount] = useState(10);
  const [seed, setSeed] = useState(42);

  const spec = useMemo<SeriesSpec>(
    () => ({
      title: title.trim() || undefined,
      kinds: kinds.length === 0 ? undefined : kinds,
      levels: levels.length === 0 ? undefined : levels,
      tags: tags.length === 0 ? undefined : tags,
      count,
      seed,
    }),
    [title, kinds, levels, tags, count, seed],
  );

  const preview = useMemo(() => resolveSeries(spec).slice(0, 12), [spec]);
  const fullCount = useMemo(
    () => resolveSeries({ ...spec, count: undefined }).length,
    [spec],
  );
  const shareUrl = useMemo(() => {
    const token = encodeSeriesParam(spec);
    const { origin, pathname } = globalThis.location;
    return `${origin}${pathname}?series=${token}#/exercises`;
  }, [spec]);

  function copyLink() {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      void navigator.clipboard.writeText(shareUrl);
    }
  }

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Share a custom series"
      style={{ width: 720 }}
    >
      <DialogBody>
        <Callout intent="primary" icon="info-sign" style={{ marginBottom: 12 }}>
          Build a deterministic series of exercises for your students. The link
          encodes every filter; two students who open it see the same exercises
          in the same order (the seed shuffles the pool).
        </Callout>

        <div className="share-grid">
          <label htmlFor="series-title">Title (optional)</label>
          <InputGroup
            id="series-title"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
            }}
            placeholder="e.g. Homework 3 — alkenes & alcohols"
          />

          <label>Kinds</label>
          <div className="share-cell">
            {ALL_KINDS.map((kind) => {
              const active = kinds.includes(kind);
              return (
                <Tag
                  key={kind}
                  interactive
                  minimal={!active}
                  intent="primary"
                  onClick={() => {
                    setKinds((prev) =>
                      prev.includes(kind)
                        ? prev.filter((value) => value !== kind)
                        : [...prev, kind],
                    );
                  }}
                >
                  {KIND_LABEL[kind]}
                </Tag>
              );
            })}
          </div>

          <label>Difficulty</label>
          <div className="share-cell">
            {ALL_LEVELS.map((level) => {
              const active = levels.includes(level);
              return (
                <Tag
                  key={level}
                  interactive
                  minimal={!active}
                  intent={LEVEL_INTENT[level]}
                  onClick={() => {
                    setLevels((prev) =>
                      prev.includes(level)
                        ? prev.filter((value) => value !== level)
                        : [...prev, level],
                    );
                  }}
                >
                  {level}
                </Tag>
              );
            })}
          </div>

          <label>Functional groups</label>
          <div className="share-cell">
            {TAG_CHOICES.map((tag) => {
              const active = tags.includes(tag);
              return (
                <Tag
                  key={tag}
                  interactive
                  minimal={!active}
                  intent="success"
                  onClick={() => {
                    setTags((prev) =>
                      prev.includes(tag)
                        ? prev.filter((value) => value !== tag)
                        : [...prev, tag],
                    );
                  }}
                >
                  {TAG_LABEL[tag]}
                </Tag>
              );
            })}
          </div>

          <label htmlFor="series-count">Number of exercises</label>
          <div className="share-cell">
            <NumericInput
              id="series-count"
              value={count}
              min={1}
              max={Math.max(1, fullCount)}
              onValueChange={(value) => {
                if (Number.isFinite(value)) setCount(Math.max(1, value));
              }}
            />
            <span className="muted" style={{ fontSize: 12 }}>
              of {fullCount} matching the filters (out of {EXERCISES.length})
            </span>
          </div>

          <label htmlFor="series-seed">Seed (shuffle)</label>
          <div className="share-cell">
            <NumericInput
              id="series-seed"
              value={seed}
              min={0}
              onValueChange={(value) => {
                if (Number.isFinite(value)) setSeed(Math.max(0, value));
              }}
            />
            <Button
              icon="random"
              variant="minimal"
              text="Randomize seed"
              onClick={() => {
                setSeed(Math.floor(Math.random() * 1_000_000));
              }}
            />
          </div>
        </div>

        {preview.length > 0 ? (
          <div style={{ marginTop: 12 }}>
            <div className="muted" style={{ fontSize: 12 }}>
              Preview (first {preview.length}):
            </div>
            <ol style={{ marginTop: 4, paddingLeft: 20 }}>
              {preview.map((exercise) => (
                <li key={exercise.id} style={{ fontSize: 13 }}>
                  {exercise.title}{' '}
                  <Tag minimal intent="primary">
                    {KIND_LABEL[exercise.kind]}
                  </Tag>
                </li>
              ))}
            </ol>
          </div>
        ) : (
          <Callout intent="warning" style={{ marginTop: 12 }}>
            No exercise matches the current filters. Loosen one of them.
          </Callout>
        )}

        <div className="share-link-row">
          <InputGroup
            readOnly
            className="share-link-input"
            value={shareUrl}
            data-testid="share-url"
          />
          <Button intent="primary" icon="clipboard" onClick={copyLink}>
            Copy link
          </Button>
        </div>
        <div className="muted" style={{ fontSize: 11, marginTop: 4 }}>
          Token:{' '}
          <Code>{shareUrl.split('?series=')[1]?.split('#')[0] ?? ''}</Code>
        </div>
      </DialogBody>
      <DialogFooter
        actions={
          <Button intent="primary" onClick={onClose}>
            Done
          </Button>
        }
      />
    </Dialog>
  );
}
