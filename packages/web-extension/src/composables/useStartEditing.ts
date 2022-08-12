import { useIsLoggedIn } from '~/stores/useAuth';
import { useShowDialog, useShowLoginOverlay } from '~/stores/useDialogState';
import { useIsEditing, useUpdateEditingState } from '~/stores/useEditingState';
import { useEpisodeUrl } from '~/stores/useEpisodeState';
import { useDisplayedTimestamps } from './useDisplayedTimestamps';

export function useStartEditing() {
  const isLoggedIn = useIsLoggedIn();
  const showLoginOverlay = useShowLoginOverlay();
  const showDialog = useShowDialog();
  const isEditing = useIsEditing();
  const updateIsEditing = useUpdateEditingState();
  const timestamps = useDisplayedTimestamps();
  const episodeUrl = useEpisodeUrl();

  return async (onStartedEditing?: () => void): Promise<void> => {
    if (!isLoggedIn.value) {
      showLoginOverlay();
    }
    if (episodeUrl.value == null) {
      await showDialog('ConnectEpisodeDialog');
      return;
    }

    if (!isEditing.value) {
      updateIsEditing({ isEditing: true, draftTimestamps: timestamps.value });
    }
    onStartedEditing?.();
  };
}
