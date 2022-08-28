import { GqlDeleteTemplateArgs } from '@anime-skip/api-client';
import { useMutation, useQueryClient } from 'vue-query';
import { useApiClient } from '../../composables/useApiClient';
import { log } from '../../utils/log';
import { useTemplateEditingStore } from '../stores/useTemplateEditingStore';
import { TimestampTypeFragment } from './useAllTimestampTypesQuery';
import {
  EpisodeUrlEpisodeTemplate,
  EpisodeUrlEpisodeTemplateFragment,
  EpisodeUrlEpisodeTimestampFragment,
  EPISODE_URL_QUERY_KEY,
} from './useFindEpisodeUrlQuery';

const query = `
  {
    ${EpisodeUrlEpisodeTemplateFragment}
    timestamps {
      ${EpisodeUrlEpisodeTimestampFragment}
      type {
        ${TimestampTypeFragment}
      }
    }
  }
`;

export function useDeleteTemplateMutation() {
  const api = useApiClient();
  const editing = useTemplateEditingStore();

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn(variables: GqlDeleteTemplateArgs) {
      return api.deleteTemplate(query, variables) as Promise<EpisodeUrlEpisodeTemplate>;
    },
    onMutate() {
      editing.isSaving = true;
    },
    onSuccess() {
      queryClient.invalidateQueries(EPISODE_URL_QUERY_KEY);
    },
    onError(err) {
      log('Failed to delete template:', err);
    },
    onSettled() {
      editing.isSaving = false;
    },
  });
}
