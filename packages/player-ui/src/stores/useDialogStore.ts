import { sleep } from 'common/src/utils/time';
import { defineStore } from 'pinia';

export enum DialogName {
  PREFERENCES = 'preferences',
  TIMESTAMPS_PANEL = 'timestamps-panel',
  CONNECT_EPISODE = 'connect-episode',
}

export const useDialogStore = defineStore('dialogs', () => {
  /**
   * The dialog that is currently open. There can only be one of these dialogs open at a time.
   */
  const activeDialog = ref<DialogName>();
  /**
   * The login dialog can be shown over other dialogs, so it's stored separately.
   */
  const isLoginOverlayVisible = ref(false);

  async function showDialog(name: DialogName) {
    if (activeDialog.value === name) return;

    // Overlay animations of closing this dialog and opening the next
    if (activeDialog.value != null) {
      activeDialog.value = undefined;
      await sleep(125);
    }
    activeDialog.value = name;
  }
  function hideDialog() {
    activeDialog.value = undefined;
  }
  function toggleDialog(name: DialogName) {
    return name === activeDialog.value ? hideDialog() : showDialog(name);
  }

  function showLoginOverlay() {
    isLoginOverlayVisible.value = true;
  }
  function hideLoginOverlay() {
    isLoginOverlayVisible.value = false;
  }

  return {
    activeDialog,
    isLoginOverlayVisible,
    showDialog,
    hideDialog,
    toggleDialog,
    showLoginOverlay,
    hideLoginOverlay,
  };
});
