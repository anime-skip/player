import { useAuthStore } from '../stores/useAuthStore';
import { DialogName, useDialogStore } from '../stores/useDialogStore';
import { useVideoController } from './useVideoController';

export function useShowConnectEpisodeDialog() {
  const dialogs = useDialogStore();
  const auth = useAuthStore();
  const { pause } = useVideoController();

  return () => {
    pause();
    if (!auth.isLoggedIn) {
      dialogs.showLoginOverlay();
    }
    dialogs.showDialog(DialogName.CONNECT_EPISODE);
  };
}
