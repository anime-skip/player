import { Ref } from 'vue';
import { AmbiguousTimestamp } from '../utils/timestamp-utils';

export default function (timestamp: Ref<AmbiguousTimestamp | undefined>) {
  const timestampTypeMap = useTimestampTypeMap();

  return computed(() =>
    timestamp.value?.typeId
      ? timestampTypeMap.value?.[timestamp.value.typeId]
      : undefined,
  );
}
