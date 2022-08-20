import { RequestState } from 'vue-use-request-state';
import { useApiClient } from '../composables/useApiClient';
import { useEpisode, useEpisodeUrl } from '../stores/useEpisodeState';
import { useTemplateTimestamps, useUpdateTemplateRequestState } from '../stores/useTemplateState';
import { log } from '~/utils/log';
import * as Api from 'common/src/api';
import { useFetchEpisodeByUrl } from './useFetchEpisodeByUrl';
import { useSaveTemplateTimestamps } from './useSaveTemplateTimestamps';

export function useSaveTemplate() {
  const api = useApiClient();
  const updateTemplateRequestState = useUpdateTemplateRequestState();
  const fetchEpisodeUrl = useFetchEpisodeByUrl();
  const episodeUrl = useEpisodeUrl();
  const episodeRef = useEpisode();
  const templateTimestamps = useTemplateTimestamps();
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

      const template: Api.Template = await api.updateTemplate(Api.TEMPLATE_DATA, {
        templateId,
        newTemplate: {
          showId: episode.show.id,
          sourceEpisodeId: episode.id,
          type,
          seasons,
        },
      });
      await saveTemplateTimestamps(
        template,
        (templateTimestamps.value?.map(ts => ts.id) as string[]) ?? [],
        selectedTimestampIds
      );

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      void fetchEpisodeUrl(episodeUrl.value!.url);
      updateTemplateRequestState(RequestState.SUCCESS);
    } catch (err) {
      log('Failed to save template:', err);
      updateTemplateRequestState(RequestState.FAILURE);
    }
  };
}
