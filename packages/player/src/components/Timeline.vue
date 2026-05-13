<script lang="ts" setup>
import { Section, buildSections } from '../utils/timestamp-utils';
import TimelinePreview from './TimelinePreview.vue';
import TimelineSection from './TimelineSection.vue';

const { currentTime, duration, playing } = useVideoControls();
const intProgress = computed(() => {
  if (!duration.value) return 0;
  return ((seekingValue.value ?? currentTime.value) / duration.value) * 100;
});

const root = ref<HTMLDivElement>();

const { isSeeking, seekingValue } = useRangeInput(
  root,
  ref(0),
  computed(() => duration.value ?? 0),
  (newValue) => {
    currentTime.value = newValue;
  },
);
watch(isSeeking, (isSeeking) => {
  playing.value = !isSeeking;
});

const timestamps = useCurrentTimestamps();
const sections = computed<Section[]>(() => {
  if (!duration.value || !timestamps.value.length) return [];
  return buildSections(timestamps.value, duration.value);
});

const { state: preferences } = usePreferences();
</script>

<template>
  <div ref="root" class="group relative h-[9px] cursor-pointer select-none">
    <!-- Timestamp Segments -->
    <template v-if="sections?.length">
      <timeline-section
        v-for="section of sections"
        :key="section.id"
        :section="section"
        :current-time="seekingValue ?? currentTime"
        :duration="duration"
        :preferences="preferences"
      />
    </template>

    <!-- No Timestamp Segments -->
    <template v-else>
      <div
        class="absolute inset-x-0 top-[3px] h-[3px] w-full bg-base-content bg-opacity-30"
      />
      <div
        class="absolute left-0 top-[3px] h-[3px] bg-primary"
        :style="{ width: `${intProgress}%` }"
      />
    </template>

    <!-- Thumb -->
    <div
      class="absolute top-0 h-[9px] w-[9px] translate-x-[-50%]"
      :style="{ left: `${intProgress}%` }"
    >
      <div
        class="pointer-events-none h-[9px] w-[9px] scale-[33%] rounded-full bg-primary transition-all group-hover:scale-100"
        :class="{
          'scale-100': isSeeking,
        }"
      />
    </div>

    <!-- Hover timestamp -->
    <timeline-preview :is-seeking="isSeeking" />
  </div>
</template>
