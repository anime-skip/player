import { useGeneralPreferences } from '~/common/state/useGeneralPreferences';
import { useIsEditing } from '../state/useEditingState';
import { usePlayHistory } from '../state/usePlayHistory';
import { useVideoState } from '../state/useVideoState';

export function useIsToolbarVisible() {
  const videoState = useVideoState();
  const playHistory = usePlayHistory();
  const preferences = useGeneralPreferences();
  const isEditing = useIsEditing();

  return computed(
    () =>
      playHistory.isInitialBuffer ||
      videoState.isActive ||
      videoState.isPaused ||
      (isEditing.value && !preferences.value.minimizeToolbarWhenEditing)
  );
}
