import { defineStore } from 'pinia';
import { useCrawlEpisodeInfoQuery } from '../composables/useCrawlEpisodeInfoQuery';

export const useCrawlEpisodeStore = defineStore('crawled-episode', () => {
  const query = useCrawlEpisodeInfoQuery();
  const crawledInfo = computed(() => query.data.value);

  return {
    crawledInfo,
    query,
  };
});
