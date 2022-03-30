import { useIsLoggedIn } from '~/common/state/useAuth';
import { useGeneralPreferences } from '~/common/state/useGeneralPreferences';
import { TIMESTAMP_TYPE_NOT_SELECTED } from '~/common/utils/constants';
import GeneralUtils from '~/common/utils/GeneralUtils';
import { warn } from '~/common/utils/log';
import UsageStats from '~/common/utils/UsageStats';
import { TimestampSource } from '~api';
import { usePlayerConfig } from '../composition/player-config';
import { useShowDialog, useShowLoginOverlay } from '../state/useDialogState';
import {
  EditTimestampMode,
  useUpdateActiveTimestamp,
  useUpdateEditTimestampMode,
} from '../state/useEditingState';
import { useVideoController } from '../state/useVideoState';
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
