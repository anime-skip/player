import { storeToRefs } from 'pinia';
import { usePreferencesStore } from '../stores/usePreferencesStore';
import { useTimestampEditingStore } from '../stores/useTimestampEditingStore';
import { useUserActivityStore } from '../stores/useUserActivityStore';
import { useVideoStateStore } from '../stores/useVideoStateStore';

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
