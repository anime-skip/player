import {
  GqlInputTimestamp,
  GqlThirdPartyTimestamp,
  GqlTimestamp,
  GqlTimestampSource,
  GqlTimestampType,
} from '@anime-skip/axios-api';

export type InputTimestamp = GqlInputTimestamp;

export { GqlTimestampSource as TimestampSource };

export interface AmbiguousTimestamp extends InputTimestamp {
  /**
   * It is a number when it is local, randomly generated. It is remote when the id is a string (GUID)
   */
  id: number | string;
  source: GqlTimestampSource;
  edited?: boolean;
}

export type TimestampType = Pick<GqlTimestampType, 'id' | 'name' | 'description'>;

export type ThirdPartyTimestamp = Pick<GqlThirdPartyTimestamp, 'id' | 'at' | 'typeId'>;

export type Timestamp = Pick<GqlTimestamp, 'id' | 'source' | 'at' | 'typeId'>;

export const SYNC_TIMESTAMPS_MUTATION = `{
  created {
    
  }
}`; // TODO
