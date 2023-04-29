import { AmbiguousTimestamp } from '../utils/timestamp-utils';
import useEditedTimestamps from './useEditedTimestamps';

/**
 * Based on your current state (editing vs not editing), return the list of timestamps that should
 * be shown on the UI.
 *
 * Returned timestamps are sorted.
 */
export default function () {
  const apiTimestamps = useApiTimestamps();

  const { isEditing } = useIsEditing();
  const editedTimestamps = useEditedTimestamps();

  return computed<AmbiguousTimestamp[]>(() => {
    if (isEditing.value) return editedTimestamps.value;
    if (apiTimestamps.value) return apiTimestamps.value;
    return [];
  });
}
