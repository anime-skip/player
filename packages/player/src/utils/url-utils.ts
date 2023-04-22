export function stripHashAndQuery(url: string): string {
  const u = new URL(url);
  u.hash = '';
  // @ts-ignore
  for (const [key] of Array.from(u.searchParams.entries())) {
    u.searchParams.delete(key);
  }
  return u.href;
}
