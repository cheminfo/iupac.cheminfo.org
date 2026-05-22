const N2S_URL = 'https://n2s.openmolecules.org/';

export interface ResolveSuccess {
  ok: true;
  /** MDL V2000 molfile with 2D coordinates as returned by openmolecules. */
  molfile: string;
  /** Canonical OpenChemLib idcode — directly comparable to grader answers. */
  idcode: string;
}

export interface ResolveFailure {
  ok: false;
  /** Human-readable diagnostic suitable for inline display. */
  error: string;
}

export type ResolveResult = ResolveSuccess | ResolveFailure;

/**
 * Resolve a compound identifier (IUPAC name, common name, CAS number or
 * SMILES) into a 2D molfile and an OpenChemLib idcode using the
 * openmolecules.org name-to-structure web service. Both formats come from
 * the same OpenChemLib pipeline as our grader, so the idcode is directly
 * comparable to exercise answers.
 * @param name - The compound identifier to resolve.
 * @returns The molfile and idcode on success, or an error message on failure.
 */
export async function resolveName(name: string): Promise<ResolveResult> {
  const trimmed = name.trim();
  if (!trimmed) return { ok: false, error: 'Compound name missing.' };
  const encoded = encodeURIComponent(trimmed);
  try {
    const [molfile, idcode] = await Promise.all([
      fetchPayload(`${N2S_URL}?name=${encoded}&what=molfile`, 'molfile'),
      fetchPayload(`${N2S_URL}?name=${encoded}&what=idcode`, 'idcode'),
    ]);
    return { ok: true, molfile, idcode };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Network error.';
    return { ok: false, error: message };
  }
}

async function fetchPayload(
  url: string,
  kind: 'molfile' | 'idcode',
): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const text = await response.text();
  if (text.startsWith('Error:')) {
    throw new Error(text.slice('Error:'.length).trim());
  }
  if (!text.startsWith('Message:')) {
    throw new Error('Unexpected response from openmolecules.org.');
  }
  const payload = text.slice('Message:'.length).replace(/^\n/, '');
  return kind === 'molfile' ? payload : payload.trim();
}
