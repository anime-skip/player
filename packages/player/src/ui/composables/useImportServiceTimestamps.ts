import { QueryKey } from '../../utils/QueryKey';
import { serviceSegmentsToTimestamps } from '../../utils/timestamp-utils';
import useEditedTimestamps from './useEditedTimestamps';

/**
 * When an episode has no Anime Skip timestamps, load the streaming service's
 * own segments (intro, credits, etc) into the editor as an unsaved draft. The
 * user can then review and save, or discard them.
 *
 * A URL is only ever imported once, so discarding the draft doesn't bring it
 * back.
 */
export default function () {
  const { getServiceSegments, serviceTimestampSource } = usePlayerOptions();
  const { data: url } = useCurrentUrlQuery();
  const { isEditing, startEditing } = useIsEditing();
  const editedTimestamps = useEditedTimestamps();
  const { duration } = useVideoControls();
  const apiTimestamps = useApiTimestamps();

  const {
    data: episodeUrl,
    isLoading: isEpisodeUrlLoading,
    error: episodeUrlError,
  } = useFindEpisodeUrlQuery();

  const { data: segments } = useQuery({
    key: () => [QueryKey.ServiceSegments, url.value ?? null],
    enabled: () => !!url.value,
    async query() {
      try {
        return await getServiceSegments();
      } catch (err) {
        console.warn('Failed to get service segments:', err);
        return [];
      }
    },
  });

  const imported = new Set<string>();

  whenever(
    computed(
      () =>
        !!url.value &&
        !!duration.value &&
        !!segments.value?.length &&
        !isEditing.value &&
        !isEpisodeUrlLoading.value &&
        !episodeUrlError.value &&
        !apiTimestamps.value &&
        !episodeUrl.value?.episode.timestamps?.length &&
        !imported.has(url.value),
    ),
    () => {
      imported.add(url.value!);
      const timestamps = serviceSegmentsToTimestamps(
        segments.value!,
        duration.value!,
        serviceTimestampSource,
      );
      if (timestamps.length === 0) return;

      startEditing([]);
      editedTimestamps.value = timestamps;
    },
    { immediate: true },
  );
}
