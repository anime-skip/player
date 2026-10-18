import { ClientError } from 'graphql-request';

import { QueryKey } from '../../utils/QueryKey';
import { MINUTE } from '../../utils/time';

export default function () {
  const client = useApiClient(false);
  const { data: url } = useCurrentUrlQuery();

  return useQuery({
    key: () => [QueryKey.FindEpisodeUrl, url.value ?? null],
    async query() {
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
    enabled: () => !!url.value,
    placeholderData: (previous) => previous,
  });
}
