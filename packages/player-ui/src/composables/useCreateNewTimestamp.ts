import { usePlayerConfig } from '../composables/usePlayerConfig';
import { TIMESTAMP_TYPE_NOT_SELECTED } from '../utils/constants';
import { TimestampSource } from 'common/src/api';
import GeneralUtils from 'common/src/utils/GeneralUtils';
import { useStartEditing } from './useStartEditing';
import { useVideoController } from '../state/composables/useVideoController';
import {
  EditTimestampMode,
  useTimestampEditingStore,
} from '../state/stores/useTimestampEditingStore';
import { DialogName, useDialogStore } from '../state/stores/useDialogStore';
import { useAuthStore } from '../state/stores/useAuthStore';
import { storeToRefs } from 'pinia';
import { usePreferencesStore } from '../state/stores/usePreferencesStore';
import { useVideoStateStore } from '../state/stores/useVideoStateStore';

export function useCreateNewTimestamp() {
  const controller = useVideoController();
  const editing = useTimestampEditingStore();
  const dialogs = useDialogStore();
  const auth = useAuthStore();
  const config = usePlayerConfig();
  const { preferences } = storeToRefs(usePreferencesStore());
  const videoState = useVideoStateStore();

  const startEditing = useStartEditing();

  return (): void => {
    controller.pause();
    if (preferences.value.createTimestampSnapBack) {
      controller.rewindToNearest(0.5);
    }

    if (!auth.isLoggedIn) {
      dialogs.isLoginOverlayVisible = true;
      dialogs.showDialog(DialogName.TIMESTAMPS_PANEL);
      return;
    }

    void config.usageClient.saveEvent('started_creating_timestamp', {
      atTime: videoState.currentTime,
    });
    startEditing(() => {
      editing.editTimestampMode = EditTimestampMode.CREATE;
      editing.activeTimestamp = {
        id: GeneralUtils.randomId(),
        at: videoState.currentTime,
        source: TimestampSource.ANIME_SKIP,
        edited: true,
        typeId: TIMESTAMP_TYPE_NOT_SELECTED,
      };
      dialogs.showDialog(DialogName.TIMESTAMPS_PANEL);
    });
  };
}
