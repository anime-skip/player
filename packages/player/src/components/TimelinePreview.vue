<script lang="ts" setup>
import { bounded } from '../utils/math-utils';
import { formatTimestampInS } from '../utils/time-utils';
import { getTimestampAtTime } from '../utils/timestamp-utils';

defineProps<{
  isSeeking: boolean;
}>();

const root = ref<HTMLDivElement>();
const tooltip = ref<HTMLDivElement>();

const { width: rootWidth } = useElementSize(root);
const { width: tooltipWidth } = useElementSize(tooltip);
const { elementX: rootElementX, isOutside } = useMouseInElement(root);
const hoverDecimalPercent = computed(
  () => rootElementX.value / rootWidth.value,
);

const padding = 8;
const left = computed(() => {
  const offset = rootElementX.value - (tooltip.value?.clientWidth ?? 0) / 2;

  const min = padding;
  const max = rootWidth.value - tooltipWidth.value - padding;
  return bounded(offset, min, max);
});

const { duration } = useVideoControls();
const hoveredTime = computed(
  () => (duration.value ?? 0) * hoverDecimalPercent.value,
);

const hoveredTimeDisplay = computed(() =>
  formatTimestampInS(hoveredTime.value, false),
);
const timestamps = useCurrentTimestamps();
const typeMap = useTimestampTypeMap();
const hoveredTimestampType = computed(() => {
  const timestamp = getTimestampAtTime(
    timestamps.value ?? [],
    hoveredTime.value,
  );
  if (!timestamp) return undefined;
  return typeMap.value?.[timestamp.typeId].name;
});
</script>

<template>
  <div ref="root" class="absolute inset-0">
    <div
      v-if="isSeeking || !isOutside"
      ref="tooltip"
      class="absolute bottom-4"
      :style="`left: ${left}px`"
    >
      <div class="flex flex-col items-center bg-neutral px-4 py-2 rounded">
        <p class="text-sm text-primary">
          {{ hoveredTimestampType }}
        </p>
        <p class="">{{ hoveredTimeDisplay }}</p>
      </div>
    </div>
  </div>
</template>
