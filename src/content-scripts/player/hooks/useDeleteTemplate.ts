import * as Api from '~/common/api';
import { useApiClient } from '~/common/hooks/useApiClient';
import RequestState from '~/common/utils/RequestState';
import { useUpdateTemplateRequestState, useUpdateTemplateState } from '../state/useTemplateState';

export function useDeleteTemplate() {
  const api = useApiClient();
  const updateTemplateState = useUpdateTemplateState();
  const updateTemplateRequestState = useUpdateTemplateRequestState();

  return async (templateId: string): Promise<void> => {
    updateTemplateRequestState(RequestState.LOADING);
    try {
      await api.deleteTemplate(Api.DELETE_TEMPLATE_MUTATION, { templateId });
      updateTemplateState({ episodeTemplate: undefined, timestamps: undefined });
      updateTemplateRequestState(RequestState.SUCCESS);
    } catch (err) {
      console.info('Failed to delete template:', err);
      updateTemplateRequestState(RequestState.FAILURE);
    }
  };
}
