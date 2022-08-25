import { useDraftTimestamps, useUpdateDraftTimestamps } from '../stores/useEditingState';
import * as Api from 'common/src/api';
import { useStartEditing } from './useStartEditing';

export function useDeleteDraftTimestamp() {
  const startEditing = useStartEditing();
  const updateDraftTimestamps = useUpdateDraftTimestamps();
  const draftTimestamps = useDraftTimestamps();

  return (deletedTimestamp: Api.AmbiguousTimestamp) => {
    startEditing(() => {
      const newTimestamps = [...draftTimestamps.value];
      const indexToRemove = newTimestamps.findIndex(draft => draft.id === deletedTimestamp.id);
      newTimestamps.splice(indexToRemove, 1);
      updateDraftTimestamps(newTimestamps);
    });
  };
}
