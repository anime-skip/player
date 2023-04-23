<script lang="ts" setup>
import IconNext from '~icons/anime-skip/next';
import IconPrevious from '~icons/anime-skip/previous';
import ToolbarButton from './ToolbarButton.vue';
import ToolbarButtonFullscreen from './ToolbarButtonFullscreen.vue';
import ToolbarButtonPlay from './ToolbarButtonPlay.vue';
import ToolbarButtonVolume from './ToolbarButtonVolume.vue';
import ToolbarButtonPreferences from './ToolbarButtonPreferences.vue';
import ToolbarAccount from './ToolbarAccount.vue';
import IconMdiAlertCircle from '~icons/mdi/alert-circle';
import IconEdit from '~icons/anime-skip/edit';
import Timeline from './Timeline.vue';
import { formatTimestampInS } from '../utils/time-utils';

defineProps<{
  /**
   * When hidden, translate the toolbar downwards, hidding it off screen.
   */
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

const currentTimestampType = useTimestampType(currentTimestamp);

const { isLoading, isError } = useEpisodeInfoQuery();
const currentTimestampDisplay = computed(() => {
  if (isLoading.value) return 'Loading...';
  if (isError.value) return 'Error';
  return currentTimestampType.value?.name ?? 'No timestamps';
});

const { pref: hideFully } = useReadonlyPreference('hideTimelineWhenMinimized');
</script>

<template>
  <div
    class="flex flex-col translate-y-0 transition-transform duration-200 z-0 before:-z-10 before:absolute before:h-36 before:inset-x-0 before:-bottom-4 before:bg-gradient-to-t before:from-base-100 before:transition-opacity before:pointer-events-none"
    :class="{
      'before:opacity-0': hidden,
      'translate-y-[53px]': hidden && !hideFully,
      'translate-y-[65px]': hidden && hideFully,
    }"
    @click.stop
  >
    <timeline v-if="duration" :class="{ '-scale-y-100': hidden }" />

    <!-- Main horizontal list -->
    <div class="flex px-2 items-center h-[3.125rem] gap-2">
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
        <p v-if="duration" class="font-bold text-xs shrink-0">
          <span class="text-base-content">{{ currentTimeDisplay }} </span>
          <span class="text-base-content text-opacity-50">
            / {{ durationDisplay }}
          </span>
        </p>

        <p class="text-xs text-base-content text-opacity-50">&bull;</p>

        <!-- Current Timestamp -->
        <div
          class="h-full flex items-center text-xs text-base-content text-opacity-50 link link-hover gap-1"
          @click="toggleTimestampsPanel"
        >
          <icon-mdi-alert-circle v-if="isError" class="w-3 h-3" />
          <p>{{ currentTimestampDisplay }}</p>
          <icon-edit v-if="!isError" class="w-3 h-3" />
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
