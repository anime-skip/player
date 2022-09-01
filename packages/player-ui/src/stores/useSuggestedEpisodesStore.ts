import { AmbiguousTimestamp, ThirdPartyEpisode } from 'common/src/api';
import { defineStore } from 'pinia';
import { AppConfig } from 'vue';

export const useSuggestedEpisodesStore = defineStore('suggested-episodes', () => {
  const inferredTimestamps = ref<AmbiguousTimestamp[]>();
  const suggestedEpisodes = ref<ThirdPartyEpisode[]>();

  return {
    inferredTimestamps,
    suggestedEpisodes,
  };
});
