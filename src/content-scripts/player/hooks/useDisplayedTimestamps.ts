/**
 * Used to return the current timestamps being displayed based on remote/template/edited timestamps
 */
export function useDisplayedTimestamps() {
  const displayTimestamps = ref<Api.AmbiguousTimestamp[]>([]);

  // TODO: Map computed value over

  return displayTimestamps;
}
