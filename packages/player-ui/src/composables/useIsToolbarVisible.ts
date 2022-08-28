import { storeToRefs } from 'pinia';
import { usePlayHistoryStore } from '../state/stores/usePlayHistoryStore';
import { usePreferencesStore } from '../state/stores/usePreferencesStore';
import { useTimestampEditingStore } from '../state/stores/useTimestampEditingStore';
import { useUserActivityStore } from '../state/stores/useUserActivityStore';
import { useVideoStateStore } from '../state/stores/useVideoStateStore';

export function useIsToolbarVisible() {
  const videoState = useVideoStateStore();
  const activity = useUserActivityStore();
  const playHistory = usePlayHistoryStore();
  const { preferences } = storeToRefs(usePreferencesStore());
  const editing = useTimestampEditingStore();

  return computed(
    () =>
      playHistory.isInitialBuffer ||
      activity.isActive ||
      videoState.isPaused ||
      (editing.isEditing && !preferences.value.minimizeToolbarWhenEditing)
  );
}
