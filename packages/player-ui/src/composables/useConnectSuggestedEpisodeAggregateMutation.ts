import { RequestState } from 'vue-use-request-state';
import { useApiClient } from './useApiClient';
import { warn } from '../utils/log';
import * as Api from 'common/src/api';
import GeneralUtils from 'common/src/utils/GeneralUtils';
import * as Mappers from 'common/src/utils/mappers';
import { useConnectEpisodeAggregateMutation } from './useConnectEpisodeAggregateMutation';
import { useTimestampEditingStore } from '../state/stores/useTimestampEditingStore';
import { useMutation, UseMutationOptions } from 'vue-query';

export interface ThirdPartyCreateEpisodeData {
  thirdPartyEpisode: Api.ThirdPartyEpisode;
  url?: string;
  duration?: number;
}

export function useConnectSuggestedEpisodeAggregateMutation(
  options?: UseMutationOptions<void, unknown, ThirdPartyCreateEpisodeData, unknown>
) {
  // const updateEpisodeRequestState = useUpdateEpisodeRequestState();
  // const saveTimestamps = useSaveTimestampsMutation();
  // const tabUrl = useTabUrl();
  // const durationRef = useDuration();
  const api = useApiClient();
  const editing = useTimestampEditingStore();

  const connectEpisode = useConnectEpisodeAggregateMutation();

  return useMutation({
    ...options,
    async mutationFn({ thirdPartyEpisode, url, duration }: ThirdPartyCreateEpisodeData) {
      const showName = thirdPartyEpisode.show.name;
      const showSearchResults: Api.ShowSearchResult[] = await api.searchShows(
        Api.SHOW_SEARCH_RESULT_DATA,
        { search: showName }
      );
      const existingShow: Api.ShowSearchResult | undefined = showSearchResults.filter(
        searchResult => searchResult.name.toLowerCase() === showName.toLowerCase()
      )[0];

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

      await connectEpisode.mutateAsync({
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
        initialTimestampsWithOffset: thirdPartyEpisode.timestamps.map<Api.AmbiguousTimestamp>(
          t => ({
            id: t.id ?? GeneralUtils.randomId(),
            at: GeneralUtils.applyTimestampsOffset(episodeUrl.timestampsOffset, t.at),
            typeId: t.typeId,
            source: thirdPartyEpisode.source,
            edited: false,
          })
        ),
      });
    },
    onMutate() {
      editing.isSaving = true;
    },
    onSettled() {
      editing.isSaving = false;
    },
    onError(err) {
      warn('Failed to connect third party episode', err);
    },
  });
}
