import { useIsLoggedIn } from '~/common/state/useAuth';
import { TIMESTAMP_TYPE_NOT_SELECTED } from '~/common/utils/Constants';
import Utils from '~/common/utils/Utils';
import { TimestampSource } from '~api';
import { useShowDialog, useShowLoginOverlay } from '../state/useDialogState';
import {
  EditTimestampMode,
  useUpdateActiveTimestamp,
  useUpdateEditTimestampMode,
} from '../state/useEditingState';
import { useVideoController } from '../state/useVideoState';
import { useStartEditing } from './useStartEditing';

export function useCreateNewTimestamp() {
  const { pause } = useVideoController();
  const startEditing = useStartEditing();
  const updateEditTimestampMode = useUpdateEditTimestampMode();
  const updateActiveTimestamp = useUpdateActiveTimestamp();
  const showDialog = useShowDialog();
  const showLoginOverlay = useShowLoginOverlay();
  const isLoggedIn = useIsLoggedIn();

  function showTimestampsPanel() {
    showDialog('TimestampsPanel');
  }

  return (): void => {
    const video = window.getVideo?.();
    if (video == null) {
      console.warn('Tried adding timestamp in a context without a video');
      return;
    }
    pause();

    if (!isLoggedIn.value) {
      showLoginOverlay();
      showTimestampsPanel();
      return;
    }

    startEditing(() => {
      updateEditTimestampMode(EditTimestampMode.ADD);
      updateActiveTimestamp({
        at: video.currentTime,
        typeId: TIMESTAMP_TYPE_NOT_SELECTED,
        id: Utils.randomId(),
        source: TimestampSource.ANIME_SKIP,
        edited: true,
      });
      showTimestampsPanel();
    });
  };
}
