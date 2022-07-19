import { RequestState } from 'vue-use-request-state';
import { useApiClient } from '~/composables/useApiClient';
import { useUpdateEpisodeRequestState, useUpdateEpisodeState } from '~/stores/useEpisodeState';
import { useUpdateEpisodeTemplate, useUpdateTemplateTimestamps } from '~/stores/useTemplateState';
import { warn } from '~/utils/log';
import * as Api from '~api';
import { useClearAllEpisodeState } from './useClearAllEpisodeState';

export function useFetchEpisodeByUrl() {
  const api = useApiClient();
  const updateEpisodeState = useUpdateEpisodeState();
  const updateTemplate = useUpdateEpisodeTemplate();
  const updateTemplateTimestamps = useUpdateTemplateTimestamps();
  const updateEpisodeRequestState = useUpdateEpisodeRequestState();
  const clearAllEpisodeState = useClearAllEpisodeState();

  return async (url: string): Promise<boolean> => {
    try {
      updateEpisodeRequestState(RequestState.LOADING);
      const {
        episode: { template, timestamps, ...episode },
        ...episodeUrl
      }: Api.EpisodeUrl = await api.findEpisodeUrl(Api.EPISODE_URL_DATA, { episodeUrl: url });
      updateEpisodeState({ episode, episodeUrl, savedTimestamps: timestamps });
      updateTemplate(template);
      updateTemplateTimestamps(
        template?.timestamps.map(ts => ({
          at: ts.at,
          id: ts.id,
          source: Api.TimestampSource.ANIME_SKIP,
          typeId: ts.typeId,
          edited: true,
        }))
      );
      updateEpisodeRequestState(RequestState.SUCCESS);
      return true;
    } catch (err) {
      warn('Failed to load episode url for ' + url, err);
      updateEpisodeRequestState(RequestState.FAILURE);
      clearAllEpisodeState();
      return false;
    }
  };
}
