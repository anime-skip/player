import {
  GqlInputTimestamp,
  GqlThirdPartyTimestamp,
  GqlTimestamp,
  GqlTimestampSource,
  GqlTimestampType,
} from '@anime-skip/axios-api';

// TimestampSource

export { GqlTimestampSource as TimestampSource };

// AmbiguousTimestamp

export interface AmbiguousTimestamp extends InputTimestamp {
  /**
   * It is a number when it is local, randomly generated. It is remote when the id is a string (GUID)
   */
  id: number | string;
  source: GqlTimestampSource;
  edited?: boolean;
}

// TimestampType

export type TimestampType = Pick<GqlTimestampType, 'id' | 'name' | 'description'>;
export const TIMESTAMP_TYPE_DATA = `{
  id name description
}`;

// ThirdPartyTimestamp

export type ThirdPartyTimestamp = Pick<GqlThirdPartyTimestamp, 'id' | 'at' | 'typeId'>;
export const THIRD_PARTY_TIMESTAMP_DATA = `{
  id
  at
  typeId
}`;

// Timestamp

export type Timestamp = Pick<GqlTimestamp, 'id' | 'source' | 'at' | 'typeId'>;
export const TIMESTAMP_DATA = `{
  id
  at
  typeId
  source
}`;

// SyncTimestampResponse

export interface SyncTimestampResponse {
  created: Timestamp[];
}
export const SYNC_TIMESTAMPS_MUTATION = `{
  created ${TIMESTAMP_DATA}
}`;

// Input

export type InputTimestamp = GqlInputTimestamp;
