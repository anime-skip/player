<template>
  <PlayerState>
    <div
      id="AnimeSkipPlayer"
      class="absolute inset-0 grid overflow-hidden bg-background bg-opacity-0"
      :class="{
        active: isActive,
        'paused bg-opacity-medium': videoState.isPaused,
        'buffering bg-opacity-medium': videoState.isBuffering,
        showing: isEpisodeInfoShowing,
      }"
      @mouseenter.prevent="onMouseMove"
      @mousemove.prevent="onMouseMove"
      @mouseleave.prevent="onMouseLeave"
      @click="togglePlayPause"
    >
      <div v-if="showBufferLoading" class="absolute inset-0 flex items-center justify-center">
        <Loading />
      </div>
      <div class="left-content opacity-0 pointer-events-none pl-8 pt-8 box-border">
        <EpisodeInfo />
      </div>
      <div class="right-content" />
      <ToolBar class="bottom-content" />

      <!-- Dialogs -->
      <ScreenshotOverlay />
      <TimestampsPanel />
      <PreferencesDialog />
      <EditEpisodeDialog />
      <LoginDialog />
    </div>
  </PlayerState>
</template>

<script lang="ts" setup>
import { useTimeout } from '@anime-skip/ui';
import { PLAYER_ACTIVITY_TIMEOUT } from '~/common/utils/Constants';
import Utils from '~/common/utils/Utils';
import { useTabUrl } from './hooks/useTabUrl';
import { useVideoElement } from './hooks/useVideoElement';
import PlayerState from './state/PlayerState.vue';
import {
  usePlayHistory,
  useResetInitialBuffer,
  useResetSkippedFromZero,
} from './state/usePlayHistory';
import { useVideoState } from './state/useVideoState';

const resetHasSkippedFromZero = useResetSkippedFromZero();
const resetInitialBuffer = useResetInitialBuffer();

// Url/Video Change

async function loadAllEpisodeData() {
  // TODO
  console.error('this.loadAllEpisodeData() action not re-implemented');
}

const tabUrl = useTabUrl();
watch(tabUrl, () => {
  resetHasSkippedFromZero();
  resetInitialBuffer();

  loadAllEpisodeData();
});

const { video, togglePlayPause, setActive, setInactive, setCurrentTime, setDuration } =
  useVideoElement();
watch(video, newVideo => {
  if (!newVideo) return;
  newVideo.playbackRate = videoState.playbackRate;
  // setCurrentTime(newVideo.currentTime); // TODO: This needed? timeupdate listener should handle this...
});

onMounted(() => {
  // TODO: waitForVideo rounds the duration, does that need to happen in useVideoElement?
  Utils.waitForVideoLoad().then(setDuration);
});

// Hover Activity

const videoState = useVideoState();

const [setActiveTimeout, clearActiveTimeout] = useTimeout();
const isActive = computed(() => videoState.isActive);
function onMouseLeave() {
  clearActiveTimeout();
  setInactive();
}
function onMouseMove() {
  clearActiveTimeout();
  setActive();
  setActiveTimeout(setInactive, PLAYER_ACTIVITY_TIMEOUT);
}

// Display flags

const playHistory = usePlayHistory();

const isEpisodeInfoShowing = computed<boolean>(
  () => videoState.isPaused || (videoState.isBuffering && playHistory.isInitialBuffer)
);
const showBufferLoading = computed<boolean>(() => videoState.isBuffering && !videoState.isPaused);
</script>

<style lang="scss">
#AnimeSkipPlayer {
  transition: 200ms;
  transition-property: background-color;
  grid-template-columns: 1fr auto;
  grid-template-rows: 1fr auto;
  grid-template-areas: 'left-content right-content' 'toolbar toolbar';
  cursor: none;
  &.active,
  &.paused {
    cursor: unset;
  }

  .left-content {
    z-index: 1;
    grid-area: left-content;
    transition: 200ms;
    transition-property: opacity;
  }
  &.showing {
    .left-content {
      opacity: 1;
      pointer-events: unset;
    }
  }

  .right-content {
    z-index: 1;
    grid-area: right-content;
  }

  .bottom-content {
    z-index: 1;
    grid-area: toolbar;
  }
}
</style>
