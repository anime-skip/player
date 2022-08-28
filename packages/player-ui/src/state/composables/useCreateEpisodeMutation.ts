import { GqlCreateEpisodeArgs, GqlCreateShowArgs } from '@anime-skip/api-client';
import { useMutation } from 'vue-query';
import { useApiClient } from '../../composables/useApiClient';
import { EpisodeUrlEpisodeFragment, EpisodeUrlEpisode } from './useFindEpisodeUrlQuery';

const query = `
  {
    ${EpisodeUrlEpisodeFragment}
  }
`;

export function useCreateEpisodeMutation() {
  const api = useApiClient();

  return useMutation({
    mutationFn(variables: GqlCreateEpisodeArgs) {
      return api.createEpisode(query, variables) as Promise<EpisodeUrlEpisode>;
    },
  });
}
