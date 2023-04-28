import { getNextTimestamp, isTimestampSkipped } from '../utils/timestamp-utils';
import useIsAutoSkipEnabled from './useIsAutoSkipEnabled';
import usePreferences from './usePreferences';

/**
 * Watch the current time and list of timestamps. Auto-skip over skipped sections if needed.
 */
export default createSharedComposable(() => {
  const { state: preferences } = usePreferences();
  const timestamps = useCurrentTimestamps();
  const isSkipping = useIsAutoSkipEnabled();
  const hasSkippedFromZero = ref(false);

  const watchedTimestamps = computed(() =>
    timestamps.value?.filter(
      (t) => !isTimestampSkipped(t.typeId, preferences.value, isSkipping.value),
    ),
  );
  const skippedTimestamps = computed(() =>
    timestamps.value?.filter((t) =>
      isTimestampSkipped(t.typeId, preferences.value, isSkipping.value),
    ),
  );

  const { currentTime, duration, playbackRate } = useVideoControls();

  watch(currentTime, (newTime, oldTime) => {
    // Basic checks that would disable skipping
    if (
      newTime == null ||
      oldTime == null ||
      newTime < oldTime ||
      !duration.value ||
      !isSkipping.value
    )
      return;

    // Don't skip if we're at the end of the video
    if (newTime >= duration.value) return;

    // Only skip if the amount of time change is small
    const timeDiff = newTime - oldTime;
    if (timeDiff > 1 * playbackRate.value) return;

    // Look at what timestamps were passed over in this time update
    // (+/- 0.0001 is to avoid floating point errors)
    const passedTimestamps = skippedTimestamps.value?.filter(
      (t) => t.at > oldTime + 0.0001 && t.at < newTime - 0.0001,
    );

    if (passedTimestamps?.length) {
      // At this point, skipping is enabled and we're going to pass over a skipped timestamp next
      // time update, so we should skip to the next timestamp or end of the video.
      const nextTimestamp = getNextTimestamp(
        watchedTimestamps.value ?? [],
        newTime,
      );
      currentTime.value = nextTimestamp?.at ?? duration.value;
      return;
    }

    // We didn't pass any timestamps, but if we're at the beginning we should skip to the first
    // timestamp
    if (oldTime > 0.1 || hasSkippedFromZero.value) return;

    const firstWatchedTimestamp = watchedTimestamps.value?.[0];
    if (
      firstWatchedTimestamp &&
      firstWatchedTimestamp.at > newTime &&
      firstWatchedTimestamp.at < duration.value
    ) {
      currentTime.value = firstWatchedTimestamp.at;
      hasSkippedFromZero.value = true;
      return;
    }
  });

  // Reset skip from 0 when video changes
  const video = useVideoElement();
  watch(video, () => {
    hasSkippedFromZero.value = false;
  });
});
