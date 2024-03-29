<script lang="ts" setup>
import { Section, buildSections } from '../utils/timestamp-utils';
import TimelineSection from './TimelineSection.vue';
import TimelinePreview from './TimelinePreview.vue';

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
  <div ref="root" class="relative h-[9px] group cursor-pointer select-none">
    <!-- Timstamp Segments -->
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

    <!-- No Timstamp Segments -->
    <template v-else>
      <div
        class="absolute inset-x-0 w-full top-[3px] h-[3px] bg-base-content bg-opacity-30"
      />
      <div
        class="absolute left-0 top-[3px] h-[3px] bg-primary"
        :style="{ width: `${intProgress}%` }"
      />
    </template>

    <!-- Thumb -->
    <div
      class="absolute w-[9px] h-[9px] top-0 translate-x-[-50%]"
      :style="{ left: `${intProgress}%` }"
    >
      <div
        class="bg-primary w-[9px] h-[9px] rounded-full transition-all scale-[33%] group-hover:scale-100 pointer-events-none"
        :class="{
          'scale-100': isSeeking,
        }"
      />
    </div>

    <!-- Hover timestamp -->
    <timeline-preview :is-seeking="isSeeking" />
  </div>
</template>
