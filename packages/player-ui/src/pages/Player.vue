<template>
  <ScopedStylesRoot>
    <div
      v-if="!isOriginalPlayerVisible"
      id="AnimeSkipPlayer"
      class="as-absolute as-inset-0 as-grid as-overflow-hidden as-bg-background as-bg-opacity-0"
      :class="{
        'as-active': isActive,
        'as-paused as-bg-opacity-medium': videoState.isPaused,
        'as-buffering as-bg-opacity-medium': videoState.isBuffering,
        'as-showing': isEpisodeInfoShowing,
        'as-opacity-0': !isPlayerVisible,
        [themeClass]: true,
      }"
      @mouseenter.prevent="onMouseEnter"
      @mousemove.prevent="onMouseMove"
      @mouseleave.prevent="onMouseLeave"
      @click="togglePlayPause()"
    >
      <div
        v-if="showBufferLoading"
        class="as-absolute as-inset-0 as-flex as-items-center as-justify-center"
      >
        <Loading />
      </div>
      <div
        class="as-left-content as-pointer-events-none as-pl-8 as-pt-8 as-box-border as-overflow-clip"
      >
        <episode-info />
      </div>
      <notification-center class="as-right-content" />
      <controls-toolbar class="as-bottom-content" />

      <div
        class="as-absolute as-bottom-20 as-z-3 as-transition-all"
        :class="{
          'as-right-79': isTimestampsPanelOpen,
          'as-right-108': isPreferencesDialogOpen,
          'as-right-12': !(isTimestampsPanelOpen || isPreferencesDialogOpen),
        }"
      >
        <SkipButton />
      </div>

      <!-- Dialogs -->
      <ScreenshotOverlay />
      <screenshot-controller
        :mouse-over="mouseOver"
        :show-player="showPlayer"
        :hide-player="hidePlayer"
      />
      <TimestampsPanel />
      <PreferencesDialog />
      <ConnectEpisodeDialog />
      <LoginDialog />
    </div>
    <return-button />
  </ScopedStylesRoot>
</template>

<script lang="ts" setup>
import { usePlayerConfig } from '../composables/usePlayerConfig';
import { useLoadAllEpisodeData } from '../composables/useLoadAllEpisodeData';
import { usePlaybackRateConnector } from '../composables/usePlaybackRateConnector';
import { useTabUrl } from '../composables/useTabUrl';
import { useTheme } from '../composables/useTheme';
import { useVideoElement } from '../composables/useVideoElement';
import { useDialogState } from '../stores/useDialogState';
import {
  useHideAnimeSkipPlayer,
  useIsAnimeSkipPlayerVisible,
  useIsOriginalPlayerVisible,
  useShowAnimeSkipPlayer,
} from '../stores/usePlayerVisibility';
import {
  usePlayHistory,
  useResetInitialBuffer,
  useResetSkippedFromZero,
} from '../stores/usePlayHistory';
import { useVideoState } from '../stores/useVideoState';
import UsageStats from '~/utils/UsageStats';
import Utils from 'common/src/utils/GeneralUtils';

onMounted(() => {
  void UsageStats.saveEvent('player_injected');
});

const dialogState = useDialogState();
const isTimestampsPanelOpen = computed(() => dialogState.activeDialog === 'TimestampsPanel');
const isPreferencesDialogOpen = computed(() => dialogState.activeDialog === 'PreferencesDialog');

const resetHasSkippedFromZero = useResetSkippedFromZero();
const resetInitialBuffer = useResetInitialBuffer();

// Url/Video Change

const loadAllEpisodeData = useLoadAllEpisodeData();
const tabUrl = useTabUrl();
watch(tabUrl, newUrl => {
  resetHasSkippedFromZero();
  resetInitialBuffer();

  if (newUrl) {
    loadAllEpisodeData(newUrl);
  }
});

const { video, togglePlayPause, setActive, setInactive, setDuration } = useVideoElement();
watch(video, newVideo => {
  if (!newVideo) return;
  newVideo.playbackRate = videoState.playbackRate;
});

// Sync the playback rate between prefs and videoState
usePlaybackRateConnector();

const playerConfig = usePlayerConfig();
onMounted(() => {
  Utils.waitForVideoLoad(playerConfig).then(setDuration);
});

// Hover Activity

const videoState = useVideoState();

const isActive = computed(() => videoState.isActive);
const mouseOver = ref(false);
function onMouseEnter() {
  mouseOver.value = true;
  setActive();
}
function onMouseLeave() {
  mouseOver.value = false;
  setInactive();
}
function onMouseMove() {
  setActive();
}

// Display flags

const playHistory = usePlayHistory();

const isEpisodeInfoShowing = computed<boolean>(
  () => videoState.isPaused || (videoState.isBuffering && playHistory.isInitialBuffer)
);
const showBufferLoading = computed<boolean>(() => videoState.isBuffering && !videoState.isPaused);

const showPlayer = useShowAnimeSkipPlayer();
const hidePlayer = useHideAnimeSkipPlayer();
const isPlayerVisible = useIsAnimeSkipPlayerVisible();
const isOriginalPlayerVisible = useIsOriginalPlayerVisible();

const { themeClass } = useTheme();
</script>

<style lang="scss" scoped>
#AnimeSkipPlayer {
  transition: 200ms;
  transition-property: background-color;
  grid-template-columns: 1fr auto;
  grid-template-rows: 1fr auto;
  grid-template-areas: 'left-content right-content' 'toolbar toolbar';
  cursor: none;
  &.as-active,
  &.as-paused {
    cursor: unset;
  }

  .as-left-content {
    z-index: 1;
    grid-area: left-content;
    transition: 200ms;
    transition-property: opacity;
  }
  &.as-showing {
    .as-left-content {
      opacity: 1;
      pointer-events: unset;
    }
  }

  .as-right-content {
    z-index: 1;
    grid-area: right-content;
  }

  .as-bottom-content {
    z-index: 1;
    grid-area: toolbar;
  }

  .as-right-79 {
    right: 19.75em;
  }

  .as-right-108 {
    right: 27em;
  }

  .as-z-3 {
    // Over the preferences dialog (z = 2) so you can click it while that dialog is open
    z-index: 3;
  }
}
</style>
