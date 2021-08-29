import * as Api from '~/common/api';
import { createProvideInject } from '~/common/utils/createProvideInject';
import Utils from '~/common/utils/Utils';

export enum EditTimestampMode {
  ADD,
  EDIT,
}

export interface EditingState {
  /**
   * Whether or not edit mode is active
   */
  isEditing: boolean;
  /**
   * Whether or not the saving action is currently running
   */
  isSaving: boolean;
  /**
   * The current timestamp being edited, or `undefined` if no timestamp is being edited
   */
  activeTimestamp?: Api.AmbiguousTimestamp;
  /**
   * If we're editing an existing timestamp, adding a new timestamp, or
   *
   * @deprecated TODO Can the timestamp panel title be computed based on the timestamp id?
   */
  editTimestampMode: EditTimestampMode;
  /**
   * The timestamps that are in the process of being edited
   */
  draftTimestamps: Api.AmbiguousTimestamp[];
}

const {
  provideValue: provideEditingState,
  useValue: useEditingState,
  useUpdate: useUpdateEditingState,
} = createProvideInject<EditingState>('editing-state', {
  isEditing: false,
  isSaving: false,
  activeTimestamp: undefined,
  // This initial value doesn't matter (set when you go to edit a timestamp)
  editTimestampMode: EditTimestampMode.ADD,
  draftTimestamps: [],
});

export { provideEditingState, useEditingState, useUpdateEditingState };

// Getters

export function useIsEditing(editingState = useEditingState()) {
  return computed(() => editingState.isEditing);
}

export function useActiveTimestamp(editingState = useEditingState()) {
  return computed(() => editingState.activeTimestamp);
}

/**
 * Return the timestamps being edited now, including the active timestamp's unsaved edits
 */
export function useDraftTimestamps(editingState = useEditingState()) {
  return computed<Api.AmbiguousTimestamp[]>(() => {
    let drafts = [...editingState.draftTimestamps];
    if (editingState.activeTimestamp != null) {
      const activeIndex = drafts.findIndex(
        timestamp => timestamp.id === editingState.activeTimestamp?.id
      );
      const activeIsExisting = activeIndex !== -1;
      if (activeIsExisting) {
        drafts.splice(activeIndex, 1, editingState.activeTimestamp);
      } else {
        drafts = [...drafts, editingState.activeTimestamp].sort(Utils.timestampSorter);
      }
    }
    return drafts;
  });
}

export function useEditTimestampMode(state = useEditingState()) {
  return computed(() => state.editTimestampMode);
}

export function useIsSavingChanges(state = useEditingState()) {
  return computed(() => state.isSaving);
}

// Mutations

export function useUpdateActiveTimestamp(update = useUpdateEditingState()) {
  return (newTimestamp: Api.AmbiguousTimestamp) => {
    update({ activeTimestamp: newTimestamp });
  };
}

export function useClearActiveTimestamp(update = useUpdateEditingState()) {
  return () => {
    update({ activeTimestamp: undefined });
  };
}

export function useUpdateEditTimestampMode(update = useUpdateEditingState()) {
  return (newMode: EditTimestampMode) => {
    update({ editTimestampMode: newMode });
  };
}

/**
 * Toggle whether or not we're saving the timestamp changes
 */
export function useUpdateIsSavingChanges(update = useUpdateEditingState()) {
  return (isSaving: boolean) => update({ isSaving });
}
