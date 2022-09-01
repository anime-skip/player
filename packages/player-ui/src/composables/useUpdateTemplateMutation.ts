import { GqlUpdateTemplateArgs } from '@anime-skip/api-client';
import { useMutation, UseMutationOptions } from 'vue-query';
import { useApiClient } from '../composables/useApiClient';
import {
  EpisodeUrlEpisodeTemplate,
  EpisodeUrlEpisodeTemplateFragment,
  EpisodeUrlEpisodeTimestampFragment,
} from './useFindEpisodeUrlQuery';

const query = `
  {
    ${EpisodeUrlEpisodeTemplateFragment}
    timestamps {
      ${EpisodeUrlEpisodeTimestampFragment}
    }
  }
`;

export function useUpdateTemplateMutation(
  options: UseMutationOptions<EpisodeUrlEpisodeTemplate, unknown, GqlUpdateTemplateArgs, unknown>
) {
  const api = useApiClient();

  return useMutation({
    ...options,
    mutationFn(args: GqlUpdateTemplateArgs): Promise<EpisodeUrlEpisodeTemplate> {
      return api.updateTemplate(query, args);
    },
  });
}
