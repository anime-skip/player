export function getErrorMessage(err: unknown): string {
  if (err == null) return '';
  if (err instanceof Error) return err.message;
  if (typeof err === 'string') return err;
  if (typeof err === 'object') return err.toString();
  return JSON.stringify(err);
}
