import { QueryKey } from '../utils/QueryKey';

export default function () {
  const options = usePlayerOptions();

  return useQuery({
    key: [QueryKey.EpisodeInfo],
    query: async () => options.getEpisodeInfo(),
  });
}
