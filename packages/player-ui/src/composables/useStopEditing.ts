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

  const saveMutation = useSaveTimestampsMutation({
    onMutate() {
      editing.isSaving = true;
    },
    onSettled() {
      editing.isSaving = false;
    },
    onSuccess() {
      clearEditingMode();
    },
  });

  return async (discardChanges?: boolean): Promise<void> => {
    if (!discardChanges) {
      await saveMutation.mutateAsync({
        episodeUrl: episodeUrl.value,
        episode: episode.value,
        newTimestampsWithOffset: editing.draftTimestamps ?? [],
        oldTimestampsWithOffset: episode.value?.timestamps ?? [],
      });
    } else {
      clearEditingMode();
    }
  };
}
