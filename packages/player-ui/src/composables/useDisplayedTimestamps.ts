import { useDraftTimestamps, useIsEditing } from '../stores/useEditingState';
import { useUneditedTimestamps } from '../stores/useEpisodeState';
import * as Api from 'common/src/api';

/**
 * Used to return the current timestamps being displayed based on remote/template/edited timestamps
 */
export function useDisplayedTimestamps() {
  const isEditing = useIsEditing();
  const draftTimestamps = useDraftTimestamps();
  const uneditedTimestamps = useUneditedTimestamps();

  return computed<Api.AmbiguousTimestamp[]>(() =>
    isEditing.value ? draftTimestamps.value : uneditedTimestamps.value
  );
}
