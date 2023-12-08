import { QueryKey } from '../utils/QueryKey';

export default function () {
  const api = useApiClient(true);
  const queries = useQueryClient();

  return useMutation(api.createEpisodeUrl, {
    onSuccess({ createEpisodeUrl: episodeUrl }, { episodeUrlInput }) {
      queries.setQueryData(
        [QueryKey.FindEpisodeUrl, episodeUrlInput.url],
        episodeUrl,
      );
    },
  });
}
