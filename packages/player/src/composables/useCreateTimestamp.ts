import { TimestampSource } from '../utils/api';
import { floorToNearest } from '../utils/math-utils';
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
  const { pref: snap } = useReadonlyPreference('createTimestampSnapBack');

  return () => {
    // Enter edit mode if necessary
    startEditing(currentTimestamps.value);

    // Pause the video
    playing.value = false;
    if (snap) {
      currentTime.value = floorToNearest(currentTime.value, 0.5, 1);
    }

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
