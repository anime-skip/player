import { RequestState } from 'vue-use-request-state';
import { useApiClient } from '../composables/useApiClient';
import { useUpdateEpisodeRequestState, useUpdateEpisodeState } from '../stores/useEpisodeState';
import { useUpdateInferredTimestamps } from '../stores/useInferredEpisodeState';
import { warn } from '~/utils/log';
import * as Api from 'common/src/api';
import * as Mappers from 'common/src/utils/mappers';

export function useFetchThirdPartyEpisode() {
  const updateEpisodeRequestState = useUpdateEpisodeRequestState();
  const updateEpisodeState = useUpdateEpisodeState();
  const updateInferredTimestamps = useUpdateInferredTimestamps();
  const api = useApiClient();

  return async (episodeName: string, showName: string): Promise<void> => {
    try {
      updateEpisodeRequestState(RequestState.LOADING);
      const episodes: Api.ThirdPartyEpisode[] = await api.findEpisodesByEpisodeAndShowName(
        Api.THIRD_PARTY_EPISODE_DATA,
        { episodeName, showName }
      );
      const episodesWithTimestamps = episodes.filter(episode => episode.timestamps.length > 0);
      if (episodesWithTimestamps.length > 0) {
        const episode = episodesWithTimestamps[0];
        const timestamps = Mappers.thirdPartyEpisodeToAmbiguousTimestamps(episode);
        updateEpisodeState({
          episodeUrl: undefined,
          episode,
        });
        updateInferredTimestamps(timestamps);
      } else {
        updateInferredTimestamps(undefined);
      }
      updateEpisodeRequestState(RequestState.SUCCESS);
    } catch (err) {
      warn('Failed to load suggestions', err);
      updateEpisodeRequestState(RequestState.FAILURE);
      updateEpisodeState({ episodeUrl: undefined, episode: undefined });
    }
  };
}
