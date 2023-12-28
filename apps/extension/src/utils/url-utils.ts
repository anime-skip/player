/**
 * Strip out hashes and query params from a url
 * @param url The input url
 */
export function stripUrl(url: string): string {
  const urlDetails = new URL(url);
  return `${urlDetails.protocol}//${urlDetails.hostname}${urlDetails.pathname}`;
}
