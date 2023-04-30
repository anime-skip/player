import { getNextTimestamp } from '../utils/timestamp-utils';

/**
 * When timestamps are located at decimals, there may be a small difference in the floating point
 * numbers between the video's current time and a timestamp's `.at`. This offset shifts the current
 * time forward by a value greator than the floating point error (which is usually on the order of
 * 1e-6).
 */
const OFFSET = 0.001; // seconds

/**
 * Returns a function that can advance the current time to the next timestamp, or the end of the
 * video if no more exist past the current time. If there are no timestamps, it goes to the end of
 * the episode.
 */
export default function () {
  const { currentTime, duration } = useVideoControls();
  const timestamps = useCurrentTimestamps();
  const { isEditing } = useIsEditing();
  const editTimestamp = useEditExistingTimestamp();

  return () => {
    if (!duration.value) return;

    const nextTimestamp = getNextTimestamp(
      timestamps.value,
      currentTime.value + OFFSET,
    );
    currentTime.value = nextTimestamp?.at ?? duration.value;

    if (isEditing.value) editTimestamp(nextTimestamp);
  };
}
