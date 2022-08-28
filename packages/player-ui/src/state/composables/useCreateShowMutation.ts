import { GqlCreateShowArgs } from '@anime-skip/api-client';
import { useMutation } from 'vue-query';
import { useApiClient } from '../../composables/useApiClient';
import { EpisodeUrlEpisodeShowFragment, EpisodeUrlEpisodeShow } from './useFindEpisodeUrlQuery';

const query = `
  {
    ${EpisodeUrlEpisodeShowFragment}
  }
`;

export function useCreateShowMutation() {
  const api = useApiClient();

  return useMutation({
    mutationFn(variables: GqlCreateShowArgs) {
      return api.createShow(query, variables) as Promise<EpisodeUrlEpisodeShow>;
    },
  });
}
