import { MaybeRefOrGetter, toValue } from 'vue';

import { Episode } from '../../utils/api';
import { QueryKey } from '../../utils/QueryKey';

export default function (
  episodeId: MaybeRefOrGetter<Episode['id'] | undefined>,
) {
  const api = useApiClient();

  return useQuery({
    key: () => [QueryKey.FindEpisode, toValue(episodeId) ?? null],
    async query() {
      const res = await api.findEpisode({ episodeId: toValue(episodeId)! });
      return res.findEpisode;
    },
    enabled: () => !!toValue(episodeId),
  });
}
