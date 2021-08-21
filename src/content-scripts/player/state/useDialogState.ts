import { createProvideInject } from '~/common/utils/createProvideInject';

type DialogId = 'PreferencesDialog' | 'TimestampsPanel';

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
  return (dialogId: DialogId) => {
    update({ activeDialog: dialogId });
  };
}

export function useHideDialog() {
  const update = useUpdateDialogState();
  return () => {
    update({ activeDialog: undefined });
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
