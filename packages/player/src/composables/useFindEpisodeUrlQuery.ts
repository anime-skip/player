import { useQuery } from 'vue-query';
import { QueryKey } from '../utils/QueryKey';

export default function () {
  const client = useApiClient(false);
  const { data: url } = useCurrentUrlQuery();

  return useQuery({
    queryKey: [QueryKey.FindEpisodeUrl, url],
    async queryFn() {
      if (url.value == null) return undefined;
      const data = await client.findEpisodeUrl({ url: url.value });
      return data.findEpisodeUrl;
    },
  });
}
