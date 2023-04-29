import { AmbiguousTimestamp } from '../utils/timestamp-utils';

export default createGlobalState(() => {
  const timestamps = ref<AmbiguousTimestamp[]>([]);
  return timestamps;
});
