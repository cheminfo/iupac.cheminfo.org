/**
 * Zero-width characters sometimes pasted from Word or Google Docs that we
 * silently drop before comparing names. Each codepoint is alternated to
 * avoid the misleading-character-class warning.
 */
const INVISIBLE = new RegExp(
  [0x20_0b, 0x20_0c, 0x20_0d, 0xfe_ff]
    .map((codepoint) => String.fromCodePoint(codepoint))
    .join('|'),
  'gu',
);

/**
 * Normalise an IUPAC name for case-insensitive, whitespace-insensitive
 * comparison. Removes invisible Unicode characters, collapses internal
 * spaces and lower-cases everything. Two names that the chemistry teacher
 * would accept as identical must produce the same canonical string.
 *
 * Hyphens, brackets, commas and stereodescriptors are intentionally kept
 * verbatim — `(2R,3R)-3-bromo-2-chloropentane` must not be accepted for
 * `3-bromo-2-chloropentane`.
 * @param name - The raw student input or reference name.
 * @returns The canonical form, ready for `===` comparison.
 */
export function normalizeIupacName(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFKC')
    .replaceAll(INVISIBLE, '')
    .replaceAll(/\s+/g, '')
    .trim();
}

/**
 * Test whether the student's typed name matches any of the accepted forms
 * for the molecule (primary IUPAC, alternative IUPAC, or trivial name).
 * @param answer - The text the student typed.
 * @param accepted - Every name considered correct for this molecule. Empty
 *   strings are silently skipped.
 * @returns `true` when one of the accepted names matches.
 */
export function isNameAccepted(
  answer: string,
  accepted: readonly string[],
): boolean {
  const normalised = normalizeIupacName(answer);
  if (!normalised) return false;
  for (const candidate of accepted) {
    if (!candidate) continue;
    if (normalizeIupacName(candidate) === normalised) return true;
  }
  return false;
}
