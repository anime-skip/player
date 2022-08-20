import { useDraftTimestamps, useUpdateEditingState } from '../stores/useEditingState';
import { useEpisodeState } from '../stores/useEpisodeState';
import { useSyncTimestamps } from './useSyncTimestamps';

export function useStopEditing() {
  const episodeState = useEpisodeState();
  const updateEditingState = useUpdateEditingState();
  const oldTimestamps = computed(() => episodeState.savedTimestamps);
  const newTimestamps = useDraftTimestamps();
  const syncTimestamps = useSyncTimestamps();

  return async (discardChanges?: boolean): Promise<void> => {
    if (!discardChanges) {
      await syncTimestamps(oldTimestamps.value, newTimestamps.value);
    }
    updateEditingState({ isEditing: false, draftTimestamps: [] });
  };
}
