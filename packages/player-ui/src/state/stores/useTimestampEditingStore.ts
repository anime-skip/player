import { AmbiguousTimestamp } from 'common/src/api';
import { defineStore } from 'pinia';

export enum EditTimestampMode {
  CREATE,
  EDIT,
}

export const useTimestampEditingStore = defineStore('timestamp-editing', () => {
  /**
   * Whether or not the player is in edit mode.
   */
  const isEditing = ref(false);
  /**
   * The current timestamp being edited, or `undefined` if none are being edited.
   */
  const activeTimestamp = ref<AmbiguousTimestamp>();
  /**
   * Whether or not the active timestamp is being created or edited.
   */
  const editTimestampMode = ref(EditTimestampMode.CREATE);
  /**
   * The list of timestamps with the edits the user has made so far in edit mode.
   */
  const draftTimestamps = ref<AmbiguousTimestamp[]>();
  /**
   * If when editing a timestamp, the video's current time should be changed alongside the
   * `activeTimestamp.at`.
   */
  const syncTimeWithVideo = ref(false);

  return {
    isEditing,
    activeTimestamp,
    editTimestampMode,
    draftTimestamps,
    syncTimeWithVideo,
  };
});
