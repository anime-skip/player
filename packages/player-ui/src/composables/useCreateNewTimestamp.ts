import { usePlayerConfig } from '../composables/usePlayerConfig';
import { TIMESTAMP_TYPE_NOT_SELECTED } from '../utils/constants';
import { TimestampSource } from 'common/src/api';
import GeneralUtils from 'common/src/utils/GeneralUtils';
import { useStartEditing } from './useStartEditing';
import { EditTimestampMode, useTimestampEditingStore } from '../stores/useTimestampEditingStore';
import { DialogName, useDialogStore } from '../stores/useDialogStore';
import { useAuthStore } from '../stores/useAuthStore';
import { storeToRefs } from 'pinia';
import { usePreferencesStore } from '../stores/usePreferencesStore';
import { useVideoStateStore } from '../stores/useVideoStateStore';

export function useCreateNewTimestamp() {
  const editing = useTimestampEditingStore();
  const dialogs = useDialogStore();
  const auth = useAuthStore();
  const config = usePlayerConfig();
  const { preferences } = storeToRefs(usePreferencesStore());
  const videoState = useVideoStateStore();

  const startEditing = useStartEditing();

  return (): void => {
    videoState.pause();
    if (preferences.value.createTimestampSnapBack) {
      videoState.rewindToNearest(0.5);
    }

    if (!auth.isLoggedIn) {
      dialogs.showLoginOverlay();
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
