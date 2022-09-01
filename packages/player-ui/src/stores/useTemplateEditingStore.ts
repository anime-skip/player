import { defineStore } from 'pinia';
import { EpisodeUrlEpisodeTimestamp } from '../composables/useFindEpisodeUrlQuery';

export const useTemplateEditingStore = defineStore('template-editing', () => {
  const isSaving = ref(false);
  const selectedTimestamps = ref<EpisodeUrlEpisodeTimestamp[]>();
  return {
    isSaving,
    selectedTimestamps,
  };
});
