import { useApiClient } from '../composables/useApiClient';
import { warn } from '../utils/log';
import * as Api from 'common/src/api';
import * as Mappers from 'common/src/utils/mappers';
import { useTimestampEditingStore } from '../state/stores/useTimestampEditingStore';
import { storeToRefs } from 'pinia';
import { useSuggestedEpisodesStore } from '../state/stores/useSuggestedEpisodesStore';

export function useFetchThirdPartyEpisode() {
  const editing = useTimestampEditingStore();
  const { inferredTimestamps, suggestedEpisodes } = storeToRefs(useSuggestedEpisodesStore());
  const api = useApiClient();

  return async (episodeName: string, showName: string): Promise<void> => {
    try {
      editing.isSaving = true;
      suggestedEpisodes.value = await api.findEpisodesByEpisodeAndShowName(
        Api.THIRD_PARTY_EPISODE_DATA,
        { episodeName, showName }
      );
      const episodesWithTimestamps = suggestedEpisodes.value.filter(
        episode => episode.timestamps.length > 0
      );
      if (episodesWithTimestamps.length > 0) {
        const episode = episodesWithTimestamps[0];
        const timestamps = Mappers.thirdPartyEpisodeToAmbiguousTimestamps(episode);

        inferredTimestamps.value = timestamps;
      } else {
        inferredTimestamps.value = undefined;
      }
    } catch (err) {
      warn('Failed to load suggestions', err);
    } finally {
      editing.isSaving = false;
    }
  };
}
