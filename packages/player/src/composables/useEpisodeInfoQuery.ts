import { QueryKey } from '../utils/QueryKey';

export default function () {
  const options = usePlayerOptions();

  return useQuery(QueryKey.EpisodeInfo, options.getEpisodeInfo);
}
