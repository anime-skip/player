import { TimestampTypeFragment } from '../utils/api';

export default createSharedComposable(() => {
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
