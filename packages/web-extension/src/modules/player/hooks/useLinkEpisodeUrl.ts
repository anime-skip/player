import { RequestState } from 'vue-use-request-state';
import { useApiClient } from '~/common/hooks/useApiClient';
import { warn } from '~/common/utils/log';
import * as Api from '~api';
import GeneralUtils from '~utils/GeneralUtils';
import { useUpdateEpisodeRequestState } from '../state/useEpisodeState';
import { useDuration } from '../state/useVideoState';
import { useLoadAllEpisodeData } from './useLoadAllEpisodeData';
import { useTabUrl } from './useTabUrl';

export function useLinkEpisodeUrl() {
  const updateEpisodeRequestState = useUpdateEpisodeRequestState();
  const tabUrl = useTabUrl();
  const durationRef = useDuration();
  const loadAllEpisodeData = useLoadAllEpisodeData();
  const api = useApiClient();

  return async (episode: Api.EpisodeSearchResult, onSuccess?: () => void): Promise<void> => {
    const url = tabUrl.value;
    const duration = durationRef.value;
    const baseDuration = episode.baseDuration;

    if (!url || !duration || !baseDuration) {
      warn('Cannot link a URL without a URL, duration, and base duration', {
        url,
        duration,
        baseDuration,
      });
      return;
    }

    updateEpisodeRequestState(RequestState.LOADING);
    let timestampsOffset: number | undefined;
    if (baseDuration != null && duration != null) {
      timestampsOffset = GeneralUtils.computeTimestampsOffset(baseDuration, duration);
    }
    const episodeUrl: Api.InputEpisodeUrl = {
      url,
      duration,
      timestampsOffset,
    };

    try {
      await api.createOrUpdateEpisodeUrl(Api.EPISODE_URL_NO_EPISODE_DATA, {
        episodeId: episode.id,
        episodeUrlInput: episodeUrl,
      });
      updateEpisodeRequestState(RequestState.SUCCESS);
      onSuccess?.();
      await loadAllEpisodeData(episodeUrl.url);
    } catch (err) {
      warn('Failed to create new EpisodeUrl', err);
      updateEpisodeRequestState(RequestState.FAILURE);
    }
  };
}
