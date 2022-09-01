import { useFindEpisodeUrlQuery } from '../composables/useFindEpisodeUrlQuery';
import { defineStore, storeToRefs } from 'pinia';
import { useTabUrlStore } from './useTabUrlStore';
import GeneralUtils from 'common/src/utils/GeneralUtils';

export const useEpisodeStore = defineStore('episode', () => {
  const { url } = storeToRefs(useTabUrlStore());

  /**
   * The query results for the Episode.
   */
  const query = useFindEpisodeUrlQuery(url);

  const episodeUrl = computed(() => query.data.value);
  const episode = computed(() => query.data.value?.episode);
  const timestamps = computed(() =>
    query.data.value?.episode.timestamps.map(t => ({
      ...t,
      at: GeneralUtils.applyTimestampsOffset(episodeUrl.value?.timestampsOffset, t.at),
    }))
  );
  const show = computed(() => query.data.value?.episode.show);
  const template = computed(() => query.data.value?.episode.template);

  return {
    url,
    query,
    timestamps,
    episode,
    episodeUrl,
    show,
    template,
  };
});
