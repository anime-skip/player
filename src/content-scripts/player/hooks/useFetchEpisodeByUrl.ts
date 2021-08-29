import * as Api from '~/common/api';
import { useApiClient } from '~/common/hooks/useApiClient';
import RequestState from '~/common/utils/RequestState';
import { useUpdateEpisodeRequestState, useUpdateEpisodeState } from '../state/useEpisodeState';
import { useUpdateEpisodeTemplate } from '../state/useTemplateState';
import { useClearAllEpisodeState } from './useClearAllEpisodeState';

export function useFetchEpisodeByUrl() {
  const api = useApiClient();
  const updateEpisodeState = useUpdateEpisodeState();
  const updateTemplate = useUpdateEpisodeTemplate();
  const updateEpisodeRequestState = useUpdateEpisodeRequestState();
  const clearAllEpisodeState = useClearAllEpisodeState();

  return async (url: string): Promise<boolean> => {
    try {
      updateEpisodeRequestState(RequestState.LOADING);
      const {
        episode: { template, timestamps, ...episode },
        ...episodeUrl
      } = await api.findEpisodeUrl(Api.EPISODE_URL_DATA, { episodeUrl: url });
      updateEpisodeState({ episode, episodeUrl, savedTimestamps: timestamps });
      updateTemplate(template);
      updateEpisodeRequestState(RequestState.SUCCESS);
      return true;
    } catch (err) {
      console.warn('Failed to load episode url for ' + url, err);
      updateEpisodeRequestState(RequestState.FAILURE);
      clearAllEpisodeState();
      return false;
    }
  };
}
