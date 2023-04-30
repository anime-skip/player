import { AmbiguousTimestamp } from '../utils/timestamp-utils';

/**
 * Given a timestamp from the edited timestamps list, start editing it. Does nothing if the
 * timestamp is not in the list.
 *
 * See `useCreateTimestamp` to create a new timestamp and start edting it.
 *
 * When passing in an `undefined` timestamp, we still enter edit mode, but we close the edit panel
 * and clear the timestamp being edited.
 */
export default function () {
  const { currentTime, playing } = useVideoControls();
  const activeTimestamp = useActiveTimestamp();
  const { view } = useView();
  const { startEditing } = useIsEditing();
  const currentTimestamps = useCurrentTimestamps();

  return (timestamp: AmbiguousTimestamp | undefined) => {
    // Start editing if necessary
    startEditing(currentTimestamps.value);

    if (timestamp) {
      playing.value = false;
      currentTime.value = timestamp.at;
      activeTimestamp.value = timestamp;
      view.value = 'edit-timestamp';
    } else {
      if (view.value === 'edit-timestamp') view.value = undefined;
      setTimeout(() => {
        // Do on next tick so that the view can be unmounted
        activeTimestamp.value = undefined;
      });
    }
  };
}
