import * as Api from 'common/src/api';
import { useTimestampEditingStore } from '../stores/useTimestampEditingStore';
import { useStartEditing } from './useStartEditing';

export function useDeleteDraftTimestamp() {
  const startEditing = useStartEditing();
  const editing = useTimestampEditingStore();

  return (deletedTimestamp: Api.AmbiguousTimestamp) => {
    startEditing(() => {
      editing.draftTimestamps = editing.draftTimestamps?.filter(
        draft => draft.id !== deletedTimestamp.id
      );
    });
  };
}
