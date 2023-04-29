import { AmbiguousTimestamp } from '../utils/timestamp-utils';

export default function () {
  const { startEditing } = useIsEditing();
  const currentTimestamps = useCurrentTimestamps();
  const editedTimestamps = useEditedTimestamps();

  return (timestamp: AmbiguousTimestamp) => {
    startEditing(currentTimestamps.value);

    const newTimestamps = editedTimestamps.value.map((t) => toRaw(t));
    const index = newTimestamps.findIndex((t) => t.id === timestamp.id);
    if (index >= 0) {
      newTimestamps.splice(index, 1);
      editedTimestamps.value = newTimestamps;
    }
  };
}
