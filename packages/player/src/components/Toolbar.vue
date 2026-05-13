<script lang="ts" setup>
import IconEdit from '~icons/anime-skip/edit';
import IconNext from '~icons/anime-skip/next';
import IconPrevious from '~icons/anime-skip/previous';
import IconMdiAlertCircle from '~icons/mdi/alert-circle';

import { formatTimestampInS } from '../utils/time-utils';
import Timeline from './Timeline.vue';
import ToolbarAccount from './ToolbarAccount.vue';
import ToolbarButton from './ToolbarButton.vue';
import ToolbarButtonFullscreen from './ToolbarButtonFullscreen.vue';
import ToolbarButtonPlay from './ToolbarButtonPlay.vue';
import ToolbarButtonPreferences from './ToolbarButtonPreferences.vue';
import ToolbarButtonVolume from './ToolbarButtonVolume.vue';

defineProps<{
  /** When hidden, translate the toolbar downwards, hiding it off screen. */
  hidden: boolean;
}>();

const { duration, currentTime, playing } = useVideoControls();

const goToNext = useGoToNext();
const goToPrevious = useGoToPrevious();

const currentTimeDisplay = computed(() =>
  formatTimestampInS(currentTime.value, !playing.value),
);
const durationDisplay = computed(
  () => duration.value && formatTimestampInS(duration.value, false),
);

const toggleTimestampsPanel = useToggleTimestampsPanel();

const currentTimestamp = useTimestampAtTime(currentTime);
const currentTimestamps = useCurrentTimestamps();

const currentTimestampType = useTimestampType(currentTimestamp);

const { isLoading, isError } = useEpisodeInfoQuery();
const currentTimestampDisplay = computed(() => {
  if (isLoading.value) return 'Loading...';
  if (isError.value) return 'Error';
  if (currentTimestamps.value.length === 0) return 'No timestamps';
  return currentTimestampType.value?.name ?? 'Unknown';
});

const { pref: hideFully } = useReadonlyPreference('hideTimelineWhenMinimized');

const { isEditing } = useIsEditing();
</script>

<template>
  <div
    class="z-0 flex translate-y-0 flex-col transition-transform duration-200 before:pointer-events-none before:absolute before:inset-x-0 before:-bottom-4 before:-z-10 before:h-36 before:bg-gradient-to-t before:from-base-100 before:transition-opacity"
    :class="{
      'before:opacity-0': hidden,
      'translate-y-[53px]': hidden && !hideFully,
      'translate-y-[65px]': hidden && hideFully,
    }"
    @click.stop
  >
    <timeline
      v-if="duration"
      class="transition"
      :class="{ '-scale-y-100': hidden, 'mx-4': isEditing }"
    />

    <!-- Main horizontal list -->
    <div class="flex h-[3.125rem] items-center gap-2 px-2">
      <toolbar-button-play />

      <!-- Previous/Next -->
      <toolbar-button @click="goToPrevious" title="Previous">
        <icon-previous />
      </toolbar-button>
      <toolbar-button @click="goToNext" title="Next">
        <icon-next />
      </toolbar-button>

      <!-- Volume -->
      <toolbar-button-volume />

      <template v-if="duration">
        <!-- Current Time -->
        <p v-if="duration" class="shrink-0 text-xs font-bold">
          <span class="text-base-content">{{ currentTimeDisplay }} </span>
          <span class="text-base-content text-opacity-50">
            / {{ durationDisplay }}
          </span>
        </p>

        <p class="shrink-0 text-xs text-base-content text-opacity-50">&bull;</p>

        <!-- Current Timestamp -->
        <div
          class="link link-hover flex h-full shrink-0 items-center gap-1 text-xs text-base-content text-opacity-50"
          @click="toggleTimestampsPanel"
        >
          <icon-mdi-alert-circle v-if="isError" class="h-3 w-3" />
          <p>{{ currentTimestampDisplay }}</p>
          <icon-edit v-if="!isError" class="h-3 w-3" />
        </div>
      </template>

      <div class="flex-1" />

      <!-- Account -->
      <toolbar-account class="shrink-0" />

      <!-- Menu -->
      <toolbar-button-preferences />

      <!-- Fullscreen -->
      <toolbar-button-fullscreen />
    </div>
  </div>
</template>
