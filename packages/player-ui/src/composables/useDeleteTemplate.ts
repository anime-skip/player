import { RequestState } from 'vue-use-request-state';
import { useApiClient } from '~/composables/useApiClient';
import { useUpdateTemplateRequestState, useUpdateTemplateState } from '~/stores/useTemplateState';
import { log } from '~/utils/log';
import * as Api from '~api';

export function useDeleteTemplate() {
  const api = useApiClient();
  const updateTemplateState = useUpdateTemplateState();
  const updateTemplateRequestState = useUpdateTemplateRequestState();

  return async (templateId: string): Promise<void> => {
    updateTemplateRequestState(RequestState.LOADING);
    try {
      await api.deleteTemplate(Api.TEMPLATE_DATA, { templateId });
      updateTemplateState({ episodeTemplate: undefined, timestamps: undefined });
      updateTemplateRequestState(RequestState.SUCCESS);
    } catch (err) {
      log('Failed to delete template:', err);
      updateTemplateRequestState(RequestState.FAILURE);
    }
  };
}
