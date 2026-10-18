import { CreateEpisodeUrlMutationVariables } from '../utils/api';
import { QueryKey } from '../utils/QueryKey';

export default function () {
  const api = useApiClient(true);
  const queryCache = useQueryCache();

  return useMutation({
    mutation: (vars: CreateEpisodeUrlMutationVariables) =>
      api.createEpisodeUrl(vars),
    onSuccess({ createEpisodeUrl: episodeUrl }, { episodeUrlInput }) {
      queryCache.setQueryData(
        [QueryKey.FindEpisodeUrl, episodeUrlInput.url],
        episodeUrl,
      );
    },
  });
}
