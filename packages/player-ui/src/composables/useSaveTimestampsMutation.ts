import { useApiClient } from './useApiClient';
import { log, warn } from '../utils/log';
import * as Api from 'common/src/api';
import GeneralUtils from 'common/src/utils/GeneralUtils';
import { isTimestampRemote } from '../utils/isTimestampLocal';
import { storeToRefs } from 'pinia';
import { useEpisodeStore } from '../state/stores/useEpisodeStore';
import { useMutation, UseMutationOptions, useQueryClient } from 'vue-query';
import {
  EpisodeUrl,
  EpisodeUrlEpisode,
  EpisodeUrlEpisodeTimestamp,
  EPISODE_URL_QUERY_KEY,
} from '../state/composables/useFindEpisodeUrlQuery';
import { AmbiguousTimestamp } from 'common/src/api';
import { GqlInputTimestamp } from '@anime-skip/api-client';

interface SaveTimestampsMutationInput {
  episodeUrl: EpisodeUrl | undefined;
  episode: EpisodeUrlEpisode | undefined;
  oldTimestampsWithOffset: EpisodeUrlEpisodeTimestamp[];
  newTimestampsWithOffset: AmbiguousTimestamp[];
}

export function useSaveTimestampsMutation() {
  const api = useApiClient();
  const queryClient = useQueryClient();

  function removeOffset<T extends Api.AmbiguousTimestamp>(episodeUrl: EpisodeUrl, timestamp: T): T {
    const at = GeneralUtils.undoTimestampOffset(episodeUrl?.timestampsOffset, timestamp.at);
    return {
      ...timestamp,
      at,
    };
  }

  return useMutation({
    async mutationFn({
      episodeUrl,
      episode,
      newTimestampsWithOffset,
      oldTimestampsWithOffset,
    }: SaveTimestampsMutationInput) {
      if (episodeUrl == null) {
        throw new Error(
          'Cannot stop editing if the episode url does not exist because there is nothing to save to'
        );
      }
      if (episode?.id == null) {
        throw new Error(
          'Cannot stop editing if the episode or its id do not exist because the id is a required field'
        );
      }
      const oldTimestamps = oldTimestampsWithOffset.map(t => removeOffset(episodeUrl, t));
      const newTimestamps = newTimestampsWithOffset.map(t => removeOffset(episodeUrl, t));

      const { toCreate, toUpdate, toDelete } = GeneralUtils.computeTimestampDiffs(
        oldTimestamps,
        newTimestamps
      );

      if (toCreate.length + toUpdate.length + toDelete.length === 0) {
        log('No timestamps to update');
        return;
      }

      const { created, updated, deleted } = await api.updateTimestamps(
        Api.SYNC_TIMESTAMPS_MUTATION,
        {
          create: toCreate.map(t => ({
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            episodeId: episode.id!,
            timestamp: {
              at: t.at,
              typeId: t.typeId,
              source: t.source,
            },
          })),
          update: toUpdate.map(t => ({
            id: t.id,
            timestamp: {
              at: t.at,
              typeId: t.typeId,
              source: t.source,
            },
          })),
          delete: toDelete.map(t => t.id),
        }
      );

      // TODO: this sort backwards?
      return [created, updated, deleted].flat().sort((l, r) => l.at - r.at);
    },
    async onSuccess() {
      await queryClient.invalidateQueries(EPISODE_URL_QUERY_KEY);
    },
  });
}
