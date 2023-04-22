import { TimestampFragment } from '../utils/api/graphql.generated';
import { Ref } from 'vue';

export default function (timestamp: Ref<TimestampFragment | undefined>) {
  const timestampTypeMap = useTimestampTypeMap();

  return computed(() =>
    timestamp.value?.typeId
      ? timestampTypeMap.value?.[timestamp.value.typeId]
      : undefined,
  );
}
