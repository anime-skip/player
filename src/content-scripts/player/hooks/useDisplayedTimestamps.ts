import * as Api from '~api';
import { useDraftTimestamps, useIsEditing } from '../state/useEditingState';
import { useUneditedTimestamps } from '../state/useEpisodeState';

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
