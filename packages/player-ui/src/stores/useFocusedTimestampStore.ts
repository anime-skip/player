import { AmbiguousTimestamp } from 'common/src/api';
import { defineStore } from 'pinia';

export const useFocusedTimestampStore = defineStore('focused-timestamp', () => {
  const timestamp = ref<AmbiguousTimestamp>();

  return { timestamp };
});
