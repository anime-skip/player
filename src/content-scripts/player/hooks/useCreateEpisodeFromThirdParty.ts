import * as Api from '~/common/api';
import { useApiClient } from '~/common/hooks/useApiClient';
import Mappers from '~/common/utils/Mappers';
import RequestState from '~/common/utils/RequestState';
import Utils from '~/common/utils/Utils';
import { useUpdateEpisodeRequestState } from '../state/useEpisodeState';
import { useDuration } from '../state/useVideoState';
import { useCreateEpisodeData } from './useCreateEpisodeData';
import { useSyncTimestamps } from './useSyncTimestamps';
import { useTabUrl } from './useTabUrl';

export function useCreateEpisodeFromThirdParty() {
  const updateEpisodeRequestState = useUpdateEpisodeRequestState();
  const createEpisode = useCreateEpisodeData();
  const syncTimestamps = useSyncTimestamps();
  const tabUrl = useTabUrl();
  const durationRef = useDuration();
  const api = useApiClient();

  return async (
    thirdPartyEpisode: Api.ThirdPartyEpisode,
    onSuccess?: () => void
  ): Promise<void> => {
    updateEpisodeRequestState(RequestState.LOADING);
    try {
      const showName = thirdPartyEpisode.show.name;
      const showSearchResults: Api.Show[] = await api.searchShows(Api.SHOW_SEARCH_QUERY, {
        search: showName,
      });
      const existingShow: Api.ShowSearchResult | undefined = showSearchResults.filter(
        searchResult => searchResult.name.toLowerCase() === showName.toLowerCase()
      )[0];

      const url = tabUrl.value;
      const duration = durationRef.value;
      if (!url || !duration) {
        throw new Error('Cannot create episode without a URL and duration');
      }
      const episode: Api.InputEpisode = {
        name: thirdPartyEpisode.name,
        absoluteNumber: thirdPartyEpisode.absoluteNumber,
        baseDuration: thirdPartyEpisode.baseDuration ?? duration,
        number: thirdPartyEpisode.number,
        season: thirdPartyEpisode.season,
      };
      const episodeUrl: Api.InputEpisodeUrl = {
        url,
        duration,
        timestampsOffset:
          // TODO: Api require baseDuration
          duration != null && thirdPartyEpisode.baseDuration != null
            ? Utils.computeTimestampsOffset(thirdPartyEpisode.baseDuration, duration)
            : undefined,
      };

      await createEpisode({
        show:
          existingShow == null
            ? {
                create: true,
                name: showName,
              }
            : {
                create: false,
                showId: existingShow.id,
              },
        episode: {
          create: true,
          data: episode,
        },
        episodeUrl: {
          create: true,
          data: episodeUrl,
        },
      });

      // Publish timestamps if present
      if (thirdPartyEpisode.timestamps.length > 0) {
        const timestamps = Mappers.thirdPartyEpisodeToAmbiguousTimestamps(thirdPartyEpisode);
        console.info(
          'Timestamps:',
          JSON.parse(
            JSON.stringify({
              original: thirdPartyEpisode.timestamps,
              prepared: Mappers.thirdPartyEpisodeToAmbiguousTimestamps(thirdPartyEpisode),
            })
          )
        );
        const offsetTimestamps = timestamps.map(timestamp => ({
          ...timestamp,
          at: Utils.applyTimestampsOffset(episodeUrl.timestampsOffset, timestamp.at),
        }));
        await syncTimestamps([], offsetTimestamps);
      }
      onSuccess?.();
      updateEpisodeRequestState(RequestState.SUCCESS);
    } catch (err) {
      console.warn('Failed to create episode from third party data', err);
      updateEpisodeRequestState(RequestState.FAILURE);
    }
  };
}
