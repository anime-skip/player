import { ComputedRef } from 'vue';
import { createProvideInject } from '~/common/utils/createProvideInject';
import * as Api from '~api';

interface HoveredTimestamp {
  timestamp?: Api.AmbiguousTimestamp;
}

const {
  provideValue: provideHoveredTimestamp,
  useValue,
  useUpdate,
} = createProvideInject<HoveredTimestamp>('hovered-timestamp', {
  timestamp: undefined,
});

export { provideHoveredTimestamp };

export function useHoveredTimestamp() {
  const value = useValue();
  return computed(() => value.timestamp);
}

export function useUpdateHoveredTimestamp() {
  const update = useUpdate();
  return (timestamp: Api.AmbiguousTimestamp | undefined) => update({ timestamp });
}

export function useHoveredTimestampId(
  hoveredTimestamp = useHoveredTimestamp()
): ComputedRef<string | number | undefined> {
  return computed(() => hoveredTimestamp.value?.id);
}

export function useClearHoveredTimestamp(updateHoveredTimestamp = useUpdateHoveredTimestamp()) {
  return () => {
    updateHoveredTimestamp(undefined);
  };
}
