import { useAuthStore } from '../stores/useAuthStore';
import { DialogName, useDialogStore } from '../stores/useDialogStore';
import { useVideoStateStore } from '../stores/useVideoStateStore';

export function useShowConnectEpisodeDialog() {
  const dialogs = useDialogStore();
  const auth = useAuthStore();
  const videoState = useVideoStateStore();

  return () => {
    videoState.pause();
    if (!auth.isLoggedIn) {
      dialogs.showLoginOverlay();
    }
    dialogs.showDialog(DialogName.CONNECT_EPISODE);
  };
}
