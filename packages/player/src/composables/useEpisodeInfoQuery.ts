import { QueryKey } from '../utils/QueryKey';

export default function () {
  const options = usePlayerOptions();
  const client = useQueryClient();

  // Reload episode info on url change
  const { data: url } = useCurrentUrlQuery();
  watch(url, (newUrl, oldUrl) => {
    console.log('URL changed:', newUrl, oldUrl);
    client.invalidateQueries(QueryKey.EpisodeInfo);
  });

  return useQuery(QueryKey.EpisodeInfo, options.getEpisodeInfo);
}
