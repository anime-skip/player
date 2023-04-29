import { SECOND } from '../utils/time';
import { getPreviousTimestamp } from '../utils/timestamp-utils';

/**
 * When going to the previous timestamp, without a minimum duration that we ignore timestamps before
 * the current time, you would never be able to call the function twice and get past the previous
 * timestamp. So we shift the current time back by an offset, and then start looking for timestamps
 * before that time.
 */
const OFFSET = 0.25; // seconds

/**
 * Returns a function that can rewind the current time to the previous timestamp, or the beginning
 * of the video if no more exist past the current time. If there are no timestamps, it goes to the
 * end of the episode.
 */
export default function () {
  const { currentTime, duration } = useVideoControls();
  const timestamps = useCurrentTimestamps();

  return () => {
    if (!duration.value) return;

    console.log({
      currentTime: currentTime.value,
      shifted: currentTime.value - OFFSET,
      timestamps: timestamps.value.map((t) => t.at),
      prev: getPreviousTimestamp(timestamps.value, currentTime.value - OFFSET)
        ?.at,
    });
    currentTime.value =
      getPreviousTimestamp(timestamps.value, currentTime.value - OFFSET)?.at ??
      0;
  };
}
