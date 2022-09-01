import { DAY } from 'common/src/utils/time';
import { useQuery } from 'vue-query';
import { useApiClient } from '../composables/useApiClient';
import * as Api from '@anime-skip/api-client';

// TimestampType

export const TimestampTypeFragment = `
    id
    name
    description
`;

export interface TimestampType extends Pick<Api.GqlTimestampType, 'id' | 'name' | 'description'> {}

// Query

const query = `
  {
    ${TimestampTypeFragment}
  }
`;

export const ALL_TIMESTAMP_TYPES_QUERY_KEY = 'all-timestamp-types';

export function useAllTimestampTypesQuery() {
  const api = useApiClient();

  return useQuery({
    queryKey: ALL_TIMESTAMP_TYPES_QUERY_KEY,
    staleTime: DAY,
    cacheTime: DAY,
    keepPreviousData: true,
    queryFn() {
      return api.allTimestampTypes(query) as Promise<TimestampType[]>;
    },
  });
}
