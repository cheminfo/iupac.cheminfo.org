import { afterEach, expect, test, vi } from 'vitest';

import { resolveName } from '../nameToStructure.ts';

const PROPANE_MOLFILE = `Message:
openmolecules.org MolfileCreator 1.0

  3  2  0  0  0  0  0  0  0  0999 V2000
    0.0000   -0.0000   -0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
   -1.3005    0.7475   -0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    1.3005    0.7475   -0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
  1  2  1  0  0  0  0
  1  3  1  0  0  0  0
M  END`;

afterEach(() => {
  vi.restoreAllMocks();
});

test('returns molfile and idcode on success', async () => {
  const fetchMock = vi
    .fn()
    .mockResolvedValueOnce(textResponse(PROPANE_MOLFILE))
    .mockResolvedValueOnce(textResponse('Message:eM@Hz@'));
  vi.stubGlobal('fetch', fetchMock);

  const result = await resolveName('propane');

  expect(result).toStrictEqual({
    ok: true,
    molfile: PROPANE_MOLFILE.replace(/^Message:\n/, ''),
    idcode: 'eM@Hz@',
  });
  expect(fetchMock).toHaveBeenCalledTimes(2);
  expect(fetchMock.mock.calls[0]?.[0]).toBe(
    'https://n2s.openmolecules.org/?name=propane&what=molfile',
  );
  expect(fetchMock.mock.calls[1]?.[0]).toBe(
    'https://n2s.openmolecules.org/?name=propane&what=idcode',
  );
});

test('URL-encodes names with spaces and special characters', async () => {
  const fetchMock = vi
    .fn()
    .mockResolvedValue(textResponse('Message:CCC'));
  vi.stubGlobal('fetch', fetchMock);

  await resolveName('hex-2-ene');

  expect(fetchMock.mock.calls[0]?.[0]).toBe(
    'https://n2s.openmolecules.org/?name=hex-2-ene&what=molfile',
  );
});

test('returns the server diagnostic for an unknown name', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue(textResponse('Error:Structure name not resolved.')),
  );

  const result = await resolveName('zzznotamolecule');

  expect(result).toStrictEqual({
    ok: false,
    error: 'Structure name not resolved.',
  });
});

test('returns an error without calling the network on an empty name', async () => {
  const fetchMock = vi.fn();
  vi.stubGlobal('fetch', fetchMock);

  const result = await resolveName('   ');

  expect(result).toStrictEqual({ ok: false, error: 'Compound name missing.' });
  expect(fetchMock).not.toHaveBeenCalled();
});

test('rejects an unexpected response body', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue(textResponse('something weird')),
  );

  const result = await resolveName('propane');

  expect(result).toStrictEqual({
    ok: false,
    error: 'Unexpected response from openmolecules.org.',
  });
});

test('reports HTTP failures', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      text: async () => '',
    }),
  );

  const result = await resolveName('propane');

  expect(result).toStrictEqual({ ok: false, error: 'HTTP 500' });
});

function textResponse(body: string): Response {
  return {
    ok: true,
    status: 200,
    text: async () => body,
  } as Response;
}
