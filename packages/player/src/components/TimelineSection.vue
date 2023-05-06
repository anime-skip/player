<script lang="ts" setup>
import { TimestampState } from '../utils/TimestampState';
import { AllPreferences } from '../utils/preferences';
import { Section, isTimestampSkipped } from '../utils/timestamp-utils';

const props = defineProps<{
  section: Section;
  currentTime: number;
  duration?: number;
  preferences: AllPreferences | undefined | null;
}>();

const leftInt = computed(() => (props.section.at / props.duration!) * 100);
const left = computed(() => `${leftInt.value}%`);
const rightInt = computed(
  () => 100 - (props.section.endAt / props.duration!) * 100,
);
const right = computed(() => {
  return `${rightInt.value}%`;
});

const currentTimeWidth = computed(
  () =>
    `${
      ((Math.min(props.currentTime, props.section.endAt) - props.section.at) /
        (props.section.endAt - props.section.at)) *
      100
    }%`,
);

const isSkipping = useIsAutoSkipEnabled();
const isSkipped = computed(() =>
  isTimestampSkipped(props.section.typeId, props.preferences, isSkipping.value),
);

const { view } = useView();
const activeTimestamp = useActiveTimestamp();
const hoveredTimestampId = useHoveredTimestampId();
const isHighlighted = computed(
  () =>
    (activeTimestamp.value?.id === props.section.id &&
      view.value === 'edit-timestamp') ||
    hoveredTimestampId.value === props.section.id,
);

const state = useTimestampEditedState(toRef(props, 'section'));
</script>

<template>
  <div class="absolute top-[3px] h-[3px]" :style="{ left, right: right }">
    <!-- Light Background -->
    <div
      class="absolute h-full w-full bg-base-content transition bg-opacity-0"
      :class="{ 'bg-opacity-30': !isSkipped }"
    />

    <!-- Primary Currnet Time -->
    <div
      v-if="!isSkipped && (currentTime ?? 0) >= section.at"
      class="absolute h-full bg-primary left-0"
      :style="{ width: currentTimeWidth }"
    />

    <!-- Tick - handwritten SVG -->
    <svg
      class="absolute left-[-6px] top-0 transition-transform"
      :class="{
        'text-primary': state === TimestampState.NotChanged,
        'text-secondary': state === TimestampState.Edited,
        'text-success': state === TimestampState.New,
        '-translate-y-2': isHighlighted,
      }"
      width="12"
      height="6"
      viewBox="0 0 2 1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0,0L1,1L2,0Z" fill="currentColor" />
    </svg>
  </div>
</template>
