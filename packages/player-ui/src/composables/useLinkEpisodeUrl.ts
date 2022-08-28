import { RequestState } from 'vue-use-request-state';
import { useApiClient } from '../composables/useApiClient';
import { warn } from '../utils/log';
import * as Api from 'common/src/api';
import GeneralUtils from 'common/src/utils/GeneralUtils';
import { useTimestampEditingStore } from '../state/stores/useTimestampEditingStore';
import { storeToRefs } from 'pinia';
import { useTabUrlStore } from '../state/stores/useTabUrlStore';
import { useVideoStateStore } from '../state/stores/useVideoStateStore';
import { useQueryClient } from 'vue-query';
import { EPISODE_URL_QUERY_KEY } from '../state/composables/useFindEpisodeUrlQuery';

export function useLinkEpisodeUrl() {
  const api = useApiClient();
  const editing = useTimestampEditingStore();
  const { url } = storeToRefs(useTabUrlStore());
  const videoState = useVideoStateStore();
  const queryClient = useQueryClient();

  return async (episode: Api.EpisodeSearchResult, onSuccess?: () => void): Promise<void> => {
    const baseDuration = episode.baseDuration;

    if (!url.value || !videoState.duration || !baseDuration) {
      warn('Cannot link a URL without a URL, duration, and base duration', {
        url,
        duration: videoState.duration,
        baseDuration,
      });
      return;
    }

    editing.isSaving = true;
    let timestampsOffset: number | undefined;
    if (baseDuration != null) {
      timestampsOffset = GeneralUtils.computeTimestampsOffset(baseDuration, videoState.duration);
    }
    const episodeUrl: Api.InputEpisodeUrl = {
      url: url.value,
      duration: videoState.duration,
      timestampsOffset,
    };

    try {
      await api.createOrUpdateEpisodeUrl(Api.EPISODE_URL_NO_EPISODE_DATA, {
        episodeId: episode.id,
        episodeUrlInput: episodeUrl,
      });
      onSuccess?.();
      queryClient.invalidateQueries(EPISODE_URL_QUERY_KEY);
    } catch (err) {
      warn('Failed to create new EpisodeUrl', err);
    } finally {
      editing.isSaving = false;
    }
  };
}
