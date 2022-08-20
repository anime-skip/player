import { RequestState } from 'vue-use-request-state';
import { useApiClient } from '../composables/useApiClient';
import { useEpisode, useEpisodeUrl } from '../stores/useEpisodeState';
import { useUpdateTemplateRequestState } from '../stores/useTemplateState';
import { warn } from '~/utils/log';
import * as Api from 'common/src/api';
import { useFetchEpisodeByUrl } from './useFetchEpisodeByUrl';
import { useSaveTemplateTimestamps } from './useSaveTemplateTimestamps';

export function useSaveNewTemplate() {
  const api = useApiClient();
  const updateTemplateRequestState = useUpdateTemplateRequestState();
  const saveTemplateTimestamps = useSaveTemplateTimestamps();
  const fetchEpisodeUrl = useFetchEpisodeByUrl();
  const episodeUrl = useEpisodeUrl();
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
      await saveTemplateTimestamps(template, [], selectedTimestampIds);

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      void fetchEpisodeUrl(episodeUrl.value!.url);
      updateTemplateRequestState(RequestState.SUCCESS);
    } catch (err) {
      warn('Failed to create template:', { type, seasons, selectedTimestampIds }, err);
      updateTemplateRequestState(RequestState.FAILURE);
    }
  };
}
