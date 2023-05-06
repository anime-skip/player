import { useQuery } from 'vue-query';
import { QueryKey } from '../utils/QueryKey';
import { MINUTE } from '../utils/time';
import { ClientError } from 'graphql-request';

export default function () {
  const client = useApiClient(false);
  const { data: url } = useCurrentUrlQuery();

  return useQuery({
    queryKey: [QueryKey.FindEpisodeUrl, url],
    async queryFn() {
      if (url.value == null) return undefined;

      try {
        const data = await client.findEpisodeUrl({ url: url.value });
        return data.findEpisodeUrl;
      } catch (err) {
        if (
          err instanceof ClientError &&
          err.response.errors?.[0].message.includes('not found')
        ) {
          return undefined;
        }
        throw err;
      }
    },
    staleTime: 30 * MINUTE,
    enabled: computed(() => !!url.value),
  });
}
