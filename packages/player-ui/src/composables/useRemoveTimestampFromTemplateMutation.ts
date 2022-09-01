import { GqlRemoveTimestampFromTemplateArgs, GqlTemplateTimestamp } from '@anime-skip/api-client';
import { useMutation, UseMutationOptions } from 'vue-query';
import { useApiClient } from '../composables/useApiClient';
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

export function useRemoveTimestampFromTemplate(
  options: UseMutationOptions<
    TemplateTimestamp,
    unknown,
    GqlRemoveTimestampFromTemplateArgs,
    unknown
  >
) {
  const api = useApiClient();

  return useMutation({
    ...options,
    mutationFn(variables: GqlRemoveTimestampFromTemplateArgs) {
      return api.removeTimestampFromTemplate(query, variables) as Promise<TemplateTimestamp>;
    },
  });
}
