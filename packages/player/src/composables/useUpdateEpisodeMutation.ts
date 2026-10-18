import {
  EpisodeFragment,
  EpisodeUrlFragment,
  UpdateEpisodeMutationVariables,
} from '../utils/api';
import { QueryKey } from '../utils/QueryKey';

export default function () {
  const api = useApiClient(true);
  const queryCache = useQueryCache();

  return useMutation({
    mutation: (vars: UpdateEpisodeMutationVariables) => api.updateEpisode(vars),
    onSuccess(data) {
      const episode: EpisodeFragment = data.updateEpisode;
      queryCache.setQueriesData<EpisodeUrlFragment | undefined>(
        { key: [QueryKey.FindEpisodeUrl] },
        (oldEpisodeUrl) => {
          if (oldEpisodeUrl == null) return oldEpisodeUrl;
          if (oldEpisodeUrl.episode.id !== episode.id) return oldEpisodeUrl;

          return {
            ...oldEpisodeUrl,
            episode,
          };
        },
      );
    },
  });
}
