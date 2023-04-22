import { useQuery } from 'vue-query';
import { QueryKey } from '../utils/QueryKey';
import { HOUR } from '../utils/time';

export default function () {
  const client = useApiClient(false);
  return useQuery({
    queryKey: QueryKey.AllTimestampTypes,
    async queryFn() {
      const data = await client.allTimestampTypes();
      return data.allTimestampTypes;
    },
    staleTime: HOUR,
  });
}
