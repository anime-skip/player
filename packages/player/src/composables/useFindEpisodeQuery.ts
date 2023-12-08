import { MaybeRefOrGetter, toValue } from '@vueuse/core';
import { Episode } from '../utils/api';
import { QueryKey } from '../utils/QueryKey';

export default function (
  episodeId: MaybeRefOrGetter<Episode['id'] | undefined>,
) {
  const api = useApiClient();

  return useQuery(
    [QueryKey.FindEpisode, episodeId],
    async () => {
      const res = await api.findEpisode({ episodeId: toValue(episodeId)! });
      return res.findEpisode;
    },
    { enabled: computed(() => !!toValue(episodeId)) },
  );
}
