import * as Api from '~/common/api';
import { useApiClient } from '~/common/hooks/useApiClient';
import Mappers from '~/common/utils/Mappers';
import RequestState from '~/common/utils/RequestState';
import { useUpdateEpisodeRequestState, useUpdateEpisodeState } from '../state/useEpisodeState';
import { useUpdateInferredTimestamps } from '../state/useInferredEpisodeState';

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
      console.warn('Failed to load suggestions', err);
      updateEpisodeRequestState(RequestState.FAILURE);
      updateEpisodeState({ episodeUrl: undefined, episode: undefined });
    }
  };
}
