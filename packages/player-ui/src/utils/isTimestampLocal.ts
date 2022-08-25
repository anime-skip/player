import * as Api from 'common/src/api';

export function isTimestampLocal(timestamp: Api.AmbiguousTimestamp): boolean {
  return typeof timestamp.id === 'number';
}

export function isTimestampRemote(timestamp: Api.AmbiguousTimestamp): timestamp is Api.Timestamp {
  return !isTimestampLocal(timestamp);
}
