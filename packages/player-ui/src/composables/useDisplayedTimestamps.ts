import * as Api from 'common/src/api';
import { useEpisodeStore } from '../state/stores/useEpisodeStore';
import { useTimestampEditingStore } from '../state/stores/useTimestampEditingStore';

/**
 * Used to return the current timestamps being displayed based on remote/template/edited timestamps
 */
export function useDisplayedTimestamps() {
  const episode = useEpisodeStore();
  const editing = useTimestampEditingStore();

  return computed<Api.AmbiguousTimestamp[]>(
    () => (editing.isEditing ? editing.draftTimestamps : episode.timestamps) ?? []
  );
}
