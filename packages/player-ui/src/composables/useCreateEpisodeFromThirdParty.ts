import { RequestState } from 'vue-use-request-state';
import { useApiClient } from '../composables/useApiClient';
import { useUpdateEpisodeRequestState } from '../stores/useEpisodeState';
import { useDuration } from '../stores/useVideoState';
import { warn } from '../utils/log';
import * as Api from 'common/src/api';
import GeneralUtils from 'common/src/utils/GeneralUtils';
import * as Mappers from 'common/src/utils/mappers';
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
      const showSearchResults: Api.ShowSearchResult[] = await api.searchShows(
        Api.SHOW_SEARCH_RESULT_DATA,
        { search: showName }
      );
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
            ? GeneralUtils.computeTimestampsOffset(thirdPartyEpisode.baseDuration, duration)
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
        const offsetTimestamps: Api.AmbiguousTimestamp[] = timestamps.map(timestamp => ({
          ...timestamp,
          at: GeneralUtils.applyTimestampsOffset(episodeUrl.timestampsOffset, timestamp.at),
        }));
        await syncTimestamps([], offsetTimestamps);
      }
      onSuccess?.();
      updateEpisodeRequestState(RequestState.SUCCESS);
    } catch (err) {
      warn('Failed to create episode from third party data', err);
      updateEpisodeRequestState(RequestState.FAILURE);
    }
  };
}
