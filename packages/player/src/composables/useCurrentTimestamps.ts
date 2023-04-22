/**
 * Based on your current state (editing vs not editing), return the list of timestamps that should
 * be shown on the UI.
 *
 * Returned timestamps are sorted.
 */
export default function () {
  const apiTimestamps = useApiTimestamps();
  // TODO: Show editing timestamps while editing.

  return readonly(apiTimestamps);
}
