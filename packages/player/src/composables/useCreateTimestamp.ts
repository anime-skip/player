import { TimestampSource } from '../utils/api';
import {
  LocalTimestamp,
  UNKNOWN_TIMESTAMP_TYPE_ID,
} from '../utils/timestamp-utils';

export default function () {
  const { startEditing } = useIsEditing();
  const currentTimestamps = useCurrentTimestamps();
  const { playing, currentTime } = useVideoControls();
  const { view } = useView();
  const activeTimestamp = useActiveTimestamp();

  return () => {
    // Enter edit mode if necessary
    startEditing(currentTimestamps.value);

    // Pause the video
    playing.value = false;

    // Set the active timestamp to a new timestamp
    const newTimestamp: LocalTimestamp = {
      id: Math.random(),
      at: currentTime.value,
      source: TimestampSource.AnimeSkip,
      typeId: UNKNOWN_TIMESTAMP_TYPE_ID,
    };
    activeTimestamp.value = newTimestamp;

    // Open the edit timestamp view
    view.value = 'edit-timestamp';
  };
}
