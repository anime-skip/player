import { Ref } from 'vue';
import { AmbiguousTimestamp } from '../utils/timestamp-utils';

export default function (sourceTimestamp: Ref<AmbiguousTimestamp>) {
  const { startEditing } = useIsEditing();
  const currentTimestamps = useCurrentTimestamps();
  const editedTimestamps = useEditedTimestamps();

  return computed({
    get() {
      return sourceTimestamp.value.typeId;
    },
    set(newTypeId) {
      console.log('Setting new type...', newTypeId);
      startEditing(currentTimestamps.value);
      const index = editedTimestamps.value.findIndex(
        (t) => t.id === sourceTimestamp.value.id,
      );
      editedTimestamps.value[index] = {
        ...editedTimestamps.value[index],
        typeId: newTypeId,
      };
    },
  });
}
