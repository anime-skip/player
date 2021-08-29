import { useIsLoggedIn } from '~/common/state/useAuth';
import { createProvideInject } from '~/common/utils/createProvideInject';
import { sleep } from '~/common/utils/GlobalUtils';
import { useVideoController } from './useVideoState';

type DialogId = 'PreferencesDialog' | 'TimestampsPanel' | 'EditEpisodeDialog';

export interface DialogState {
  /**
   * The current dialog id being displayed, or `undefined` if no dialogs are shown
   */
  activeDialog?: DialogId;
  /**
   * Whether or not the login dialog is overlaid on top of the player and other dialogs. Some
   * dialogs require being logged in, so this one is separated from the others and is in it's own
   * "group"
   */
  isShowingLoginOverlay: boolean;
}

const {
  provideValue: provideDialogState,
  useValue: useDialogState,
  useUpdate: useUpdateDialogState,
} = createProvideInject<DialogState>('dialog-state', {
  activeDialog: undefined,
  isShowingLoginOverlay: false,
});

export { provideDialogState, useDialogState, useUpdateDialogState };

export function useShowDialog() {
  const update = useUpdateDialogState();
  const state = useDialogState();
  return async (dialogId: DialogId) => {
    if (state.activeDialog === dialogId) return;

    if (state.activeDialog) {
      update({ activeDialog: undefined });
      await sleep(125); // TODO: test. Overlap with second dialog (timestamp panel -> preferences dialog)
    }

    if (dialogId) update({ activeDialog: dialogId });
  };
}

export function useHideDialog() {
  const update = useUpdateDialogState();
  const state = useDialogState();
  return async () => {
    if (state.activeDialog === undefined) return;

    if (state.activeDialog) {
      update({ activeDialog: undefined });
      await sleep(125); // TODO: test. Overlap with second dialog (timestamp panel -> preferences dialog)
    }
  };
}

export function useToggleDialog() {
  const update = useUpdateDialogState();
  const state = useDialogState();
  return (dialogId: DialogId) => {
    update({
      activeDialog: state.activeDialog === dialogId ? undefined : dialogId,
    });
  };
}

export function useShowLoginOverlay() {
  const update = useUpdateDialogState();
  return () => {
    update({ isShowingLoginOverlay: true });
  };
}

export function useHideLoginOverlay() {
  const update = useUpdateDialogState();
  return () => {
    update({ isShowingLoginOverlay: false });
  };
}

export function useShowConnectEpisodeDialog() {
  const showLoginOverlay = useShowLoginOverlay();
  const showDialog = useShowDialog();
  const isLoggedIn = useIsLoggedIn();
  const { pause } = useVideoController();
  return () => {
    pause();
    if (!isLoggedIn.value) {
      showLoginOverlay();
    }
    showDialog('EditEpisodeDialog'); // TODO: rename to ConnectEpisodeDialog
  };
}
