/**
 * Split a hash-route into segments. `'#/exercises/foo'` → `['exercises', 'foo']`.
 * Empty hash → `['']`.
 * @param hash - The hash string, including the leading `#`.
 * @returns The slash-separated segments.
 */
export function parseHashPath(hash: string): string[] {
  return hash.replace(/^#\/?/, '').split('/');
}

/**
 * Read the `?series=` query-string parameter from a full URL. Returns
 * `null` when the URL has no query string or the parameter is absent.
 * @param url - The URL to inspect (typically `window.location.href`).
 * @returns The raw series token, or `null`.
 */
export function readSeriesParam(url: string): string | null {
  try {
    const parsed = new URL(url);
    return parsed.searchParams.get('series');
  } catch {
    return null;
  }
}
