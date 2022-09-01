import { GqlAddTimestampToTemplateArgs, GqlTemplateTimestamp } from '@anime-skip/api-client';
import { useMutation, UseMutationOptions } from 'vue-query';
import { useApiClient } from './useApiClient';
import {
  EpisodeUrlEpisodeTimestamp,
  EpisodeUrlEpisodeTimestampFragment,
} from './useFindEpisodeUrlQuery';

export const TemplateTimestampFragment = `
  templateId
  timestampId
`;

interface TemplateTimestamp extends Pick<GqlTemplateTimestamp, 'templateId' | 'timestampId'> {
  timestamp: EpisodeUrlEpisodeTimestamp;
}

const query = `
  {
    ${TemplateTimestampFragment}
    timestamp {
      ${EpisodeUrlEpisodeTimestampFragment}
    }
  }
`;

export function useAddTimestampToTemplateMutation(
  options: UseMutationOptions<TemplateTimestamp, unknown, GqlAddTimestampToTemplateArgs, unknown>
) {
  const api = useApiClient();

  return useMutation({
    ...options,
    mutationFn(variables: GqlAddTimestampToTemplateArgs) {
      return api.addTimestampToTemplate(query, variables) as Promise<TemplateTimestamp>;
    },
  });
}
