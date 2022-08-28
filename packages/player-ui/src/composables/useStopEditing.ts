import { storeToRefs } from 'pinia';
import { useEpisodeStore } from '../state/stores/useEpisodeStore';
import { useTimestampEditingStore } from '../state/stores/useTimestampEditingStore';
import { useSaveTimestampsMutation } from './useSaveTimestampsMutation';

export function useStopEditing() {
  const editing = useTimestampEditingStore();
  const { episodeUrl, episode } = storeToRefs(useEpisodeStore());

  function clearEditingMode() {
    editing.isEditing = false;
    editing.draftTimestamps = undefined;
    editing.activeTimestamp = undefined;
  }

  const saveTimestamps = useSaveTimestampsMutation();

  return async (discardChanges?: boolean): Promise<void> => {
    if (!discardChanges) {
      editing.isSaving = true;
      await saveTimestamps.mutateAsync(
        {
          episodeUrl: episodeUrl.value,
          episode: episode.value,
          newTimestampsWithOffset: editing.draftTimestamps ?? [],
          oldTimestampsWithOffset: episode.value?.timestamps ?? [],
        },
        {
          onSettled() {
            editing.isSaving = false;
          },
          onSuccess() {
            clearEditingMode();
          },
        }
      );
    } else {
      clearEditingMode();
    }
  };
}
