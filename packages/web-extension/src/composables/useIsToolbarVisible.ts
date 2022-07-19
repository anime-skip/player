import { useIsEditing } from '~/stores/useEditingState';
import { useGeneralPreferences } from '~/stores/useGeneralPreferences';
import { usePlayHistory } from '~/stores/usePlayHistory';
import { useVideoState } from '~/stores/useVideoState';

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
