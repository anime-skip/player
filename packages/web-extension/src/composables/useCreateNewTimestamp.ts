import { usePlayerConfig } from '~/composables/player-config';
import { useIsLoggedIn } from '~/stores/useAuth';
import { useShowDialog, useShowLoginOverlay } from '~/stores/useDialogState';
import {
  EditTimestampMode,
  useUpdateActiveTimestamp,
  useUpdateEditTimestampMode,
} from '~/stores/useEditingState';
import { useGeneralPreferences } from '~/stores/useGeneralPreferences';
import { useVideoController } from '~/stores/useVideoState';
import { TIMESTAMP_TYPE_NOT_SELECTED } from '~/utils/constants';
import { warn } from '~/utils/log';
import UsageStats from '~/utils/UsageStats';
import { TimestampSource } from '~api';
import GeneralUtils from '~utils/GeneralUtils';
import { useStartEditing } from './useStartEditing';

export function useCreateNewTimestamp() {
  const { pause, rewindToNearest } = useVideoController();
  const startEditing = useStartEditing();
  const updateEditTimestampMode = useUpdateEditTimestampMode();
  const updateActiveTimestamp = useUpdateActiveTimestamp();
  const showDialog = useShowDialog();
  const showLoginOverlay = useShowLoginOverlay();
  const isLoggedIn = useIsLoggedIn();
  const preferences = useGeneralPreferences();
  const playerConfig = usePlayerConfig();

  function showTimestampsPanel() {
    showDialog('TimestampsPanel');
  }

  return (): void => {
    const video = playerConfig.getVideo?.();
    if (video == null) {
      warn('Tried adding timestamp in a context without a video');
      return;
    }
    pause();
    if (preferences.value.createTimestampSnapBack) {
      rewindToNearest(0.5);
    }

    if (!isLoggedIn.value) {
      showLoginOverlay();
      showTimestampsPanel();
      return;
    }

    void UsageStats.saveEvent('started_creating_timestamp', { atTime: video.currentTime });
    startEditing(() => {
      updateEditTimestampMode(EditTimestampMode.ADD);
      updateActiveTimestamp({
        at: video.currentTime,
        typeId: TIMESTAMP_TYPE_NOT_SELECTED,
        id: GeneralUtils.randomId(),
        source: TimestampSource.ANIME_SKIP,
        edited: true,
      });
      showTimestampsPanel();
    });
  };
}
