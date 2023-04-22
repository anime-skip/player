import { QueryKey } from '../utils/QueryKey';

export default function () {
  const options = usePlayerOptions();

  // TODO: refresh on video change, refresh on URL change

  return useQuery(QueryKey.EpisodeInfo, options.getEpisodeInfo);
}
