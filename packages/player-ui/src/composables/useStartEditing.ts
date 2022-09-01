import { storeToRefs } from 'pinia';
import { useDisplayedTimestamps } from '../composables/useDisplayedTimestamps';
import { useAuthStore } from '../stores/useAuthStore';
import { DialogName, useDialogStore } from '../stores/useDialogStore';
import { useEpisodeStore } from '../stores/useEpisodeStore';
import { useTimestampEditingStore } from '../stores/useTimestampEditingStore';

export function useStartEditing() {
  const auth = useAuthStore();
  const dialogs = useDialogStore();
  const editing = useTimestampEditingStore();
  const { episodeUrl, timestamps } = storeToRefs(useEpisodeStore());

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
