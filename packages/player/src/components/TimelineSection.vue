<script lang="ts" setup>
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

const isSkipped = computed(() =>
  isTimestampSkipped(props.section.typeId, props.preferences),
);
</script>

<template>
  <div class="absolute top-[3px] h-[3px]" :style="{ left, right: right }">
    <!-- Light Background -->
    <div
      v-if="!isSkipped"
      class="absolute h-full w-full bg-base-content bg-opacity-30"
    />

    <!-- Primary Currnet Time -->
    <div
      v-if="!isSkipped && (currentTime ?? 0) >= section.at"
      class="absolute h-full bg-primary left-0"
      :style="{ width: currentTimeWidth }"
    />

    <!-- Tick -->
    <svg
      class="absolute left-[-6px] top-0 text-primary"
      width="12"
      height="6"
      viewBox="0 0 2 1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0,0L1,1L2,0Z" fill="currentColor" />
    </svg>
  </div>
</template>
