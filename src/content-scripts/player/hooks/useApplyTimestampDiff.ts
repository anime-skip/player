import * as Api from '~/common/api';
import { useEpisodeState } from '../state/useEpisodeState';

/**
 * Return a utility that will compare the passed in timestamp to the one that is saved remotely,
 * updating the `edited` flag if it has been edited
 */
export function useApplyTimestampDiff(episodeState = useEpisodeState()) {
  return (timestamp: Api.Timestamp | Api.AmbiguousTimestamp): Api.AmbiguousTimestamp => {
    const original = episodeState.savedTimestamps.find(t => t.id === timestamp.id);
    const edited = original?.at !== timestamp.at || original.typeId !== timestamp.typeId;
    return {
      ...timestamp,
      edited,
    };
  };
}
