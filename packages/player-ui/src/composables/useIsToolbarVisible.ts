import { storeToRefs } from 'pinia';
import { usePreferencesStore } from '../state/stores/usePreferencesStore';
import { useTimestampEditingStore } from '../state/stores/useTimestampEditingStore';
import { useUserActivityStore } from '../state/stores/useUserActivityStore';
import { useVideoStateStore } from '../state/stores/useVideoStateStore';

export function useIsToolbarVisible() {
  const videoState = useVideoStateStore();
  const activity = useUserActivityStore();
  const { preferences } = storeToRefs(usePreferencesStore());
  const editing = useTimestampEditingStore();

  return computed(
    () =>
      activity.isActive ||
      !videoState.playing ||
      (editing.isEditing && !preferences.value.minimizeToolbarWhenEditing)
  );
}
