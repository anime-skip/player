export function cleanupUrl(
  url: string,
  options?: { allowedQueryParams?: string[]; keepHash?: boolean }
): string {
  const input = new URL(url);
  const output = new URL(input.origin + input.pathname);

  if (options?.keepHash) output.hash = input.hash;
  options?.allowedQueryParams?.forEach(name => {
    const inputQueryParam = input.searchParams.get(name);
    if (inputQueryParam != null) output.searchParams.append(name, inputQueryParam);
  });

  return output.href.replace(/\/$/g, '').replace(/\/#/g, '#').replace(/\/\?/g, '?');
}
