import { GqlCreateEpisodeUrlArgs } from '@anime-skip/api-client';
import { useMutation } from 'vue-query';
import { useApiClient } from '../../composables/useApiClient';
import { EpisodeUrlFragment, EpisodeUrl } from './useFindEpisodeUrlQuery';

const query = `
  {
    ${EpisodeUrlFragment}
  }
`;

export function useCreateOrUpdateEpisodeUrlMutation() {
  const api = useApiClient();

  return useMutation({
    mutationFn(variables: GqlCreateEpisodeUrlArgs) {
      return api.createOrUpdateEpisodeUrl(query, variables) as Promise<EpisodeUrl>;
    },
  });
}
