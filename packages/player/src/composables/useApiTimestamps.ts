import { applyTimestampsOffset } from '../utils/timestamp-utils';

/**
 * Wrapper around `useFindEpisodeUrlQuery` returning only the `Show` if it has loaded.
 */
export default function () {
  const { data } = useFindEpisodeUrlQuery();
  return computed(() => {
    const timestamps = data.value?.episode.timestamps;
    if (!timestamps || timestamps.length === 0) return undefined;
    return applyTimestampsOffset(timestamps, data.value?.timestampsOffset ?? 0);
  });
}
