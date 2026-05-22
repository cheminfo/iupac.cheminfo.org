import { expect, test } from 'vitest';

import { isNameAccepted, normalizeIupacName } from '../normalize.ts';

test('lower-cases and trims', () => {
  expect(normalizeIupacName('  Butan-1-ol  ')).toBe('butan-1-ol');
});

test('keeps locant markers verbatim', () => {
  expect(normalizeIupacName('(2R,3R)-3-bromo-2-chloropentane')).toBe(
    '(2r,3r)-3-bromo-2-chloropentane',
  );
});

test('drops zero-width characters pasted from a doc', () => {
  const withInvisibles = '​butan-1-ol‌';

  expect(normalizeIupacName(withInvisibles)).toBe('butan-1-ol');
});

test('collapses inner whitespace', () => {
  expect(normalizeIupacName('butyric  acid')).toBe('butyricacid');
});

test('isNameAccepted matches any candidate, ignoring case/whitespace', () => {
  expect(
    isNameAccepted('Butanoic Acid', ['butanoic acid', 'butyric acid']),
  ).toBe(true);
  expect(
    isNameAccepted('BUTYRIC ACID ', ['butanoic acid', 'butyric acid']),
  ).toBe(true);
  expect(isNameAccepted('butanal', ['butanoic acid'])).toBe(false);
});

test('isNameAccepted rejects empty student input', () => {
  expect(isNameAccepted('   ', ['butanoic acid'])).toBe(false);
});

test('isNameAccepted skips empty candidates', () => {
  expect(isNameAccepted('butan-1-ol', ['', 'butan-1-ol'])).toBe(true);
  expect(isNameAccepted('butan-1-ol', ['', ''])).toBe(false);
});
