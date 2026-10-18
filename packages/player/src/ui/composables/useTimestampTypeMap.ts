import { TimestampTypeFragment } from '../../utils/api';
import { createAppState } from '../../utils/app-state';

export default createAppState(() => {
  const { data: types } = useAllTimestampTypesQuery();

  return computed(() =>
    types.value?.reduce<
      Record<TimestampTypeFragment['id'], TimestampTypeFragment>
    >((map, timestamp) => {
      map[timestamp.id] = timestamp;
      return map;
    }, {}),
  );
});
