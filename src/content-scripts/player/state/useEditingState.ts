import { createProvideInject } from '~/common/utils/createProvideInject';

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
});

export { provideEditingState, useEditingState, useUpdateEditingState };

export function useSetActiveTimestamp() {
  const update = useUpdateEditingState();
  return (newTimestamp: Api.AmbiguousTimestamp) => {
    update({ activeTimestamp: newTimestamp });
  };
}

export function clearActiveTimestamp() {
  const update = useUpdateEditingState();
  return () => {
    update({ activeTimestamp: undefined });
  };
}

export function useSetEditTimestampMode() {
  const update = useUpdateEditingState();
  return (newMode: EditTimestampMode) => {
    update({ editTimestampMode: newMode });
  };
}
