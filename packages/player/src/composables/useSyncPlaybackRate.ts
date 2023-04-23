import { SECOND } from '../utils/time';

/**
 * Keep the playback rate of the video in sync with the playback rate preference.
 */
export default createSharedComposable(() => {
  const { pref: prefRate } = useReadonlyPreference('playbackRate');
  const { playbackRate: videoRate } = useVideoControls();

  watch(
    prefRate,
    (newRate) => {
      videoRate.value = newRate ?? 1;
    },
    { immediate: true },
  );

  // Make sure the rate isn't changed by another source
  useIntervalFn(() => {
    if (videoRate.value !== prefRate.value)
      videoRate.value = prefRate.value ?? 1;
  }, 5 * SECOND);
});
