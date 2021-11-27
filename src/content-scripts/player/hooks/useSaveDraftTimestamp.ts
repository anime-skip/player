import GeneralUtils from '~/common/utils/Utils';
import * as Api from '~api';
import { useDraftTimestamps, useUpdateDraftTimestamps } from '../state/useEditingState';

export function useSaveDraftTimestamp() {
  const updateDraftTimestamps = useUpdateDraftTimestamps();
  const draftTimestamps = useDraftTimestamps();

  return (newTimestamp: Api.AmbiguousTimestamp) => {
    const index = draftTimestamps.value.findIndex(
      draftTimestamp => draftTimestamp.id === newTimestamp.id
    );
    let unsortedTimestamps: Api.AmbiguousTimestamp[];
    if (index == -1) {
      unsortedTimestamps = [...draftTimestamps.value, newTimestamp];
    } else {
      unsortedTimestamps = [...draftTimestamps.value];
      unsortedTimestamps[index] = newTimestamp;
    }
    updateDraftTimestamps(unsortedTimestamps.sort(GeneralUtils.timestampSorter));
  };
}
