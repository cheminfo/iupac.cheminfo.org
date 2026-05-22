import { expect, test } from 'vitest';

import { EXERCISES } from '../exercises.ts';
import {
  decodeSeriesParam,
  encodeSeriesParam,
  resolveSeries,
  seededShuffle,
} from '../series.ts';

test('seededShuffle is deterministic for the same seed', () => {
  const list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  expect(seededShuffle(list, 42)).toStrictEqual(seededShuffle(list, 42));
});

test('seededShuffle returns a different order for a different seed', () => {
  const list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  expect(seededShuffle(list, 42)).not.toStrictEqual(seededShuffle(list, 7));
});

test('seededShuffle does not mutate the input', () => {
  const list = [1, 2, 3, 4, 5];
  const before = list.slice();
  seededShuffle(list, 42);

  expect(list).toStrictEqual(before);
});

test('resolveSeries filters by level', () => {
  const resolved = resolveSeries({ levels: ['advanced'] });

  expect(resolved.length).toBeGreaterThan(0);

  for (const exercise of resolved) {
    expect(exercise.level).toBe('advanced');
  }
});

test('resolveSeries filters by tag', () => {
  const resolved = resolveSeries({ tags: ['ester'], count: 20 });

  expect(resolved.length).toBeGreaterThan(0);

  for (const exercise of resolved) {
    expect(exercise.tags).toContain('ester');
  }
});

test('resolveSeries with a seed and a count is deterministic', () => {
  const a = resolveSeries({
    kinds: ['structure-to-name'],
    seed: 12_345,
    count: 5,
  });
  const b = resolveSeries({
    kinds: ['structure-to-name'],
    seed: 12_345,
    count: 5,
  });

  expect(a.map((exercise) => exercise.id)).toStrictEqual(
    b.map((exercise) => exercise.id),
  );
  expect(a).toHaveLength(5);
});

test('resolveSeries accepts explicit ids and drops unknown ones', () => {
  const known = EXERCISES.slice(0, 3).map((exercise) => exercise.id);
  const resolved = resolveSeries({
    ids: [...known, 'unknown:does-not-exist'],
  });

  expect(resolved.map((exercise) => exercise.id)).toStrictEqual(known);
});

test('encode/decode round-trip preserves the spec', () => {
  const spec = {
    title: 'HW 1',
    kinds: ['structure-to-name' as const],
    levels: ['beginner' as const, 'intermediate' as const],
    tags: ['ester' as const, 'amine' as const],
    count: 10,
    seed: 99,
  };
  const token = encodeSeriesParam(spec);

  expect(decodeSeriesParam(token)).toStrictEqual(spec);
});

test('decodeSeriesParam returns null on garbage input', () => {
  expect(decodeSeriesParam(null)).toBeNull();
  expect(decodeSeriesParam('')).toBeNull();
  expect(decodeSeriesParam('not-base64!!')).toBeNull();
});
