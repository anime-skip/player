import * as Api from '~/common/api';
import { useApiClient } from '~/common/hooks/useApiClient';
import RequestState from '~/common/utils/RequestState';
import { useEpisode } from '../state/useEpisodeState';
import { useUpdateEpisodeTemplate, useUpdateTemplateRequestState } from '../state/useTemplateState';
import { useSaveTemplateTimestamps } from './useSaveTemplateTimestamps';

export function useSaveTemplate() {
  const api = useApiClient();
  const updateTemplateRequestState = useUpdateTemplateRequestState();
  const updateTemplate = useUpdateEpisodeTemplate();
  const episodeRef = useEpisode();
  const saveTemplateTimestamps = useSaveTemplateTimestamps();

  return async (
    templateId: string,
    type: Api.TemplateType,
    seasons: string[] | undefined,
    selectedTimestampIds: string[]
  ): Promise<void> => {
    updateTemplateRequestState(RequestState.LOADING);
    try {
      const episode = episodeRef.value as Api.Episode | undefined;
      if (!episode?.show) throw Error('Cannot save a template when there is no episode or show');

      const template = await api.updateTemplate(Api.TEMPLATE_DATA, {
        templateId,
        newTemplate: {
          showId: episode.show.id,
          sourceEpisodeId: episode.id,
          type,
          seasons,
        },
      });
      template.timestampIds = await saveTemplateTimestamps(template, selectedTimestampIds);

      updateTemplate(template);
      updateTemplateRequestState(RequestState.SUCCESS);
    } catch (err) {
      console.info('Failed to save template:', err);
      updateTemplateRequestState(RequestState.FAILURE);
    }
  };
}
