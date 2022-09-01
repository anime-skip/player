import * as Api from 'common/src/api';
import { storeToRefs } from 'pinia';
import { useEpisodeStore } from '../stores/useEpisodeStore';

/**
 * Return a utility that will compare the passed in timestamp to the one that is saved remotely,
 * updating the `edited` flag if it has been edited
 */
export function useApplyTimestampDiff() {
  const { timestamps } = storeToRefs(useEpisodeStore());

  return (timestamp: Api.Timestamp | Api.AmbiguousTimestamp): Api.AmbiguousTimestamp => {
    const original = timestamps.value?.find(t => t.id === timestamp.id);
    const edited = original?.at !== timestamp.at || original.typeId !== timestamp.typeId;
    return {
      ...timestamp,
      edited,
    };
  };
}
