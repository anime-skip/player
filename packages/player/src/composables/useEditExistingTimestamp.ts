import { AmbiguousTimestamp } from '../utils/timestamp-utils';

/**
 * Given a timestamp from the edited timestamps list, start editing it. Does nothing if the
 * timestamp is not in the list.
 *
 * See `useCreateTimestamp` to create a new timestamp and start edting it.
 */
export default function () {
  const { currentTime, playing } = useVideoControls();
  const activeTimestamp = useActiveTimestamp();
  const { view } = useView();
  const { startEditing } = useIsEditing();
  const currentTimestamps = useCurrentTimestamps();

  return (timestamp: AmbiguousTimestamp) => {
    // Start editing if necessary
    startEditing(currentTimestamps.value);

    // Pause
    playing.value = false;

    // Go to the timestamp
    currentTime.value = timestamp.at;

    // Set the timestamp to edit
    activeTimestamp.value = timestamp;

    // Open the view
    view.value = 'edit-timestamp';
  };
}
