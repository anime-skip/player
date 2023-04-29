import { AmbiguousTimestamp } from '../utils/timestamp-utils';
import useEditedTimestamps from './useEditedTimestamps';

/**
 * Global state for whether the player is in edit mode.
 */
export default createGlobalState(() => {
  const isEditing = ref(false);
  const editedTimestamps = useEditedTimestamps();

  return {
    isEditing: readonly(isEditing),
    /**
     * If not editing, start editing.
     */
    startEditing(timestamps: AmbiguousTimestamp[]) {
      if (!isEditing.value) {
        isEditing.value = true;
        editedTimestamps.value = timestamps;
      }
    },
    /**
     * If editing, stop editing.
     */
    stopEditing() {
      if (isEditing.value) {
        isEditing.value = false;
        editedTimestamps.value = [];
      }
    },
  };
});
