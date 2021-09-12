import * as Api from '~api';

export function isTimestampLocal(timestamp: Api.AmbiguousTimestamp): boolean {
  return typeof timestamp.id === 'number';
}

export function isTimestampRemote(timestamp: Api.AmbiguousTimestamp): timestamp is Api.Timestamp {
  return !isTimestampLocal(timestamp);
}
