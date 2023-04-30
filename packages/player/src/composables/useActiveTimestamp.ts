import { AmbiguousTimestamp, sortTimestamps } from '../utils/timestamp-utils';

/**
 * A reactive, writable reference to the timestamp being edited. Works with `v-model`, and keeps the
 * edited timestamps up to date.
 *
 * You must set the entire value, not a field on the value
 */
export default createGlobalState(() => {
  const index = ref<number>();
  const editedTimestamps = useEditedTimestamps();

  return computed<Readonly<AmbiguousTimestamp> | undefined>({
    get() {
      if (index.value == null) return;

      return editedTimestamps.value[index.value];
    },
    set(newTimestamp) {
      if (newTimestamp == null) {
        index.value = undefined;
        return;
      }

      let newIndex = editedTimestamps.value.findIndex(
        (t) => t.id === newTimestamp.id,
      );

      if (newIndex >= 0) {
        editedTimestamps.value[newIndex] = newTimestamp;
      } else {
        const newTimestamps = editedTimestamps.value.map((t) => toRaw(t));
        newTimestamps.push(newTimestamp);
        sortTimestamps(newTimestamps);
        editedTimestamps.value = newTimestamps;

        newIndex = newTimestamps.findIndex((t) => t.id === newTimestamp.id);
      }

      index.value = newIndex;
    },
  });
});
