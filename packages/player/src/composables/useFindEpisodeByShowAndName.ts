import { Ref } from 'vue';
import { QueryKey } from '../utils/QueryKey';

/**
 * Given an episode and show name, return the first matching `ThirdPartyEpisode` from the API.
 */
export default function ({
  episodeName,
  showName,
  enabled,
}: {
  episodeName: Ref<string | undefined>;
  showName: Ref<string | undefined>;
  enabled: Ref<boolean>;
}) {
  const api = useApiClient(false);

  return useQuery(
    [QueryKey.FindEpisodeByName, episodeName, showName],

    async () => {
      const eName = episodeName.value;
      const sName = showName.value?.toLowerCase();
      if (!eName || !sName) return;

      const data = await api.findEpisodeByName({ name: eName });
      const lowerEName = eName?.toLowerCase();
      return data.findEpisodeByName.find(
        (episode) =>
          episode.name?.toLowerCase() === lowerEName &&
          episode.show.name.toLowerCase() === sName,
      );
    },

    {
      enabled,
      cacheTime: Infinity,
      staleTime: Infinity,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  );
}
