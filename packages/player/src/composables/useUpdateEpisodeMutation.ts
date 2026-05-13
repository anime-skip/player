import { EpisodeFragment, EpisodeUrlFragment } from '../utils/api';
import { QueryKey } from '../utils/QueryKey';

export default function () {
  const api = useApiClient(true);
  const queries = useQueryClient();

  return useMutation(api.updateEpisode, {
    onSuccess(data) {
      const episode: EpisodeFragment = data.updateEpisode;
      queries.setQueriesData([QueryKey.FindEpisodeUrl], (oldData: any) => {
        if (oldData == null) return oldData;

        const oldEpisodeUrl = oldData as EpisodeUrlFragment;
        if (oldEpisodeUrl.episode.id !== episode.id) return oldEpisodeUrl;

        return {
          ...oldEpisodeUrl,
          episode,
        };
      });
    },
  });
}
