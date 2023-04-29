import { AmbiguousTimestamp } from '../utils/timestamp-utils';

/**
 * Based on your current state (editing vs not editing), return the list of timestamps that should
 * be shown on the UI.
 *
 * Returned timestamps are sorted.
 */
export default function () {
  const apiTimestamps = useApiTimestamps();

  return computed<AmbiguousTimestamp[]>(() => {
    if (apiTimestamps.value) return apiTimestamps.value;
    return [];
  });
}
