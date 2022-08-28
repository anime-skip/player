import { storeToRefs } from 'pinia';
import { useDisplayedTimestamps } from '../composables/useDisplayedTimestamps';
import { useAuthStore } from '../state/stores/useAuthStore';
import { DialogName, useDialogStore } from '../state/stores/useDialogStore';
import { useEpisodeStore } from '../state/stores/useEpisodeStore';
import { useTimestampEditingStore } from '../state/stores/useTimestampEditingStore';

export function useStartEditing() {
  const auth = useAuthStore();
  const dialogs = useDialogStore();
  const editing = useTimestampEditingStore();
  const timestamps = useDisplayedTimestamps();
  const { episodeUrl } = storeToRefs(useEpisodeStore());

  return async (onStartedCallback?: () => void): Promise<void> => {
    if (!auth.isLoggedIn) {
      dialogs.isLoginOverlayVisible = true;
    }
    if (episodeUrl.value == null) {
      dialogs.showDialog(DialogName.CONNECT_EPISODE);
      return;
    }

    if (!editing.isEditing) {
      editing.isEditing = true;
      editing.draftTimestamps = timestamps.value;
    }
    onStartedCallback?.();
  };
}
