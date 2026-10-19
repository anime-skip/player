import { QueryKey } from '../../utils/QueryKey';

/**
 * Episode info read from the page. Keyed by the current URL so info from a
 * previous episode is never returned for a new URL.
 */
export default function () {
  const options = usePlayerOptions();
  const { data: url } = useCurrentUrlQuery();

  return useQuery({
    key: () => [QueryKey.EpisodeInfo, url.value ?? null],
    enabled: () => url.value != null,
    query: async () => options.getEpisodeInfo(),
  });
}
