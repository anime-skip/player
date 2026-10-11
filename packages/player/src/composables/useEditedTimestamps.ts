import { createAppState } from '../utils/app-state';
import { AmbiguousTimestamp } from '../utils/timestamp-utils';

export default createAppState(() => {
  const timestamps = ref<AmbiguousTimestamp[]>([]);
  return timestamps;
});
