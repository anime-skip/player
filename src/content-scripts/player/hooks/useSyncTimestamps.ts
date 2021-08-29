import * as Api from '~/common/api';
import { useApiClient } from '~/common/hooks/useApiClient';
import Utils from '~/common/utils/Utils';
import { useUpdateEditingState } from '../state/useEditingState';
import { useEpisode, useEpisodeUrl, useUpdateEpisodeState } from '../state/useEpisodeState';
import { isTimestampRemote } from '../utils/isTimestampLocal';
import { useFetchEpisodeByUrl } from './useFetchEpisodeByUrl';

export function useSyncTimestamps() {
  const episode = useEpisode();
  const episodeUrl = useEpisodeUrl();
  const api = useApiClient();
  const updateEditingState = useUpdateEditingState();
  const updateEpisodeState = useUpdateEpisodeState();
  const loadEpisodeByUrl = useFetchEpisodeByUrl();

  function removeOffset<T extends Api.AmbiguousTimestamp>(timestamp: T): T {
    const at = Utils.undoTimestampOffset(episodeUrl.value?.timestampsOffset, timestamp.at);
    return {
      ...timestamp,
      at,
    };
  }

  return async (
    oldTimestampsWithOffset: Api.Timestamp[],
    newTimestampsWithOffset: Api.AmbiguousTimestamp[]
  ) => {
    const currentEpisodeUrl = episodeUrl.value;
    const currentEpisode = episode.value;
    if (currentEpisodeUrl == null) {
      throw new Error(
        'Cannot stop editing if the episode url does not exist because there is nothing to save to'
      );
    }
    if (currentEpisode?.id == null) {
      throw new Error(
        'Cannot stop editing if the episode or its id do not exist because the id is a required field'
      );
    }
    const oldTimestamps = oldTimestampsWithOffset.map(removeOffset);
    const newTimestamps = newTimestampsWithOffset.map(removeOffset);

    updateEditingState({ isSaving: true });
    const { toCreate, toUpdate, toDelete } = Utils.computeTimestampDiffs(
      oldTimestamps,
      newTimestamps
    );
    // TODO: Does this change feel right without updating the displayed timestamps immediately?
    // updateEpisodeState({ savedTimestamps: newTimestamps });
    try {
      const { created } = await api.updateTimestamps(Api.SYNC_TIMESTAMPS_MUTATION, {
        create: toCreate.map(timestamp => ({
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          episodeId: currentEpisode.id!,
          timestamp,
        })),
        update: toUpdate.map(timestamp => ({
          id: timestamp.id,
          timestamp,
        })),
        delete: toDelete.map(({ id }) => id),
      });
      const newSavedTimestamps = newTimestamps.map<Api.Timestamp>(t => {
        if (isTimestampRemote(t)) {
          return t;
        } else {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const id = created.find(createdT => createdT.at === t.at)!.id;
          return {
            at: t.at,
            id: id,
            source: t.source,
            typeId: t.typeId,
          };
        }
      });
      updateEpisodeState({ savedTimestamps: newSavedTimestamps });
    } catch (err) {
      console.warn('Failed to sync timestamp changes:', err);
    } finally {
      updateEditingState({ isSaving: false });
      void loadEpisodeByUrl(currentEpisodeUrl.url);
    }
  };
}
