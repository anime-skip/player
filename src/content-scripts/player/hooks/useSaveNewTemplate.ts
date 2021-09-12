import { RequestState } from 'vue-use-request-state';
import { useApiClient } from '~/common/hooks/useApiClient';
import * as Api from '~api';
import { useEpisode } from '../state/useEpisodeState';
import { useUpdateEpisodeTemplate, useUpdateTemplateRequestState } from '../state/useTemplateState';
import { useSaveTemplateTimestamps } from './useSaveTemplateTimestamps';

export function useSaveNewTemplate() {
  const api = useApiClient();
  const updateTemplateRequestState = useUpdateTemplateRequestState();
  const updateTemplate = useUpdateEpisodeTemplate();
  const saveTemplateTimestamps = useSaveTemplateTimestamps();
  const episodeRef = useEpisode();

  return async (
    type: Api.TemplateType,
    seasons: string[] | undefined,
    selectedTimestampIds: string[]
  ): Promise<void> => {
    updateTemplateRequestState(RequestState.LOADING);
    try {
      const episode = episodeRef.value as Api.Episode | undefined;
      if (!episode?.show) throw Error('Cannot create a template when there is no episode or show');

      // Publish and build local template
      const template = await api.createTemplate(Api.TEMPLATE_DATA, {
        newTemplate: {
          showId: episode.show.id,
          type,
          seasons,
          sourceEpisodeId: episode.id,
        },
      });
      template.timestampIds = await saveTemplateTimestamps(template, selectedTimestampIds);

      updateTemplate(template);
      updateTemplateRequestState(RequestState.SUCCESS);
    } catch (err) {
      console.warn('Failed to create template:', { type, seasons, selectedTimestampIds }, err);
      updateTemplateRequestState(RequestState.FAILURE);
    }
  };
}
