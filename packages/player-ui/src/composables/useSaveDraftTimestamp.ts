import * as Api from 'common/src/api';
import GeneralUtils from 'common/src/utils/GeneralUtils';
import { useTimestampEditingStore } from '../stores/useTimestampEditingStore';
import { warn } from '../utils/log';

export function useSaveDraftTimestamp() {
  const editing = useTimestampEditingStore();

  return (newTimestamp: Api.AmbiguousTimestamp) => {
    if (editing.draftTimestamps == null) {
      warn('Cannot save draft timestamp when none exist');
      return;
    }
    const index = editing.draftTimestamps.findIndex(
      draftTimestamp => draftTimestamp.id === newTimestamp.id
    );
    let unsortedTimestamps: Api.AmbiguousTimestamp[];
    if (index == -1) {
      unsortedTimestamps = [...editing.draftTimestamps, newTimestamp];
    } else {
      unsortedTimestamps = [...editing.draftTimestamps];
      unsortedTimestamps[index] = newTimestamp;
    }
    editing.draftTimestamps = unsortedTimestamps.sort(GeneralUtils.timestampSorter);
  };
}
