import { createAppState } from '../../utils/app-state';
import type { SaveContext } from './useGetLiveContext';

/**
 * Unsaved changes left behind when the player moved to another episode while
 * editing. They stay here until the user saves or discards them.
 */
export default createAppState(() => {
  const { isEditing, stopEditing } = useIsEditing();
  const { data: currentUrl } = useCurrentUrlQuery();
  const getLiveContext = useGetLiveContext();

  const pending = shallowRef<SaveContext[]>([]);
  const form = useEditEpisodeForm();
  const { duration } = useVideoControls();
  const timestamps = useCurrentTimestamps();
  const episodeUrl = useApiEpisodeUrl();

  let snapshot: SaveContext | undefined;
  watch(
    [
      isEditing,
      currentUrl,
      duration,
      timestamps,
      form.showName,
      form.episodeName,
      form.season,
      form.number,
      form.absoluteNumber,
      episodeUrl,
    ],
    () => {
      if (!isEditing.value) {
        snapshot = undefined;
        return;
      }
      if (snapshot && snapshot.url !== currentUrl.value) return;
      snapshot = getLiveContext();
    },
    { flush: 'sync', deep: true, immediate: true },
  );

  return {
    pending,
    /** Move in-progress edits to the pending list and leave edit mode. */
    stashEdits() {
      if (!isEditing.value) return;
      if (snapshot && snapshot.url !== currentUrl.value) {
        pending.value = [...pending.value, snapshot];
      }
      snapshot = undefined;
      stopEditing();
    },
    remove(context: SaveContext) {
      pending.value = pending.value.filter((p) => p !== context);
    },
  };
});
