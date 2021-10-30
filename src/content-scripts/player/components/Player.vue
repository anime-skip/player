<template>
  <div
    id="AnimeSkipPlayer"
    class="absolute inset-0 grid overflow-hidden bg-background bg-opacity-0"
    :class="{
      active: isActive,
      'paused bg-opacity-medium': videoState.isPaused,
      'buffering bg-opacity-medium': videoState.isBuffering,
      showing: isEpisodeInfoShowing,
      'opacity-0': isHidden,
    }"
    @mouseenter.prevent="onMouseEnter"
    @mousemove.prevent="onMouseMove"
    @mouseleave.prevent="onMouseLeave"
    @click="togglePlayPause()"
  >
    <div v-if="showBufferLoading" class="absolute inset-0 flex items-center justify-center">
      <Loading />
    </div>
    <div class="left-content pointer-events-none pl-8 pt-8 box-border">
      <episode-info />
    </div>
    <div class="right-content" />
    <controls-toolbar class="bottom-content" />

    <!-- Dialogs -->
    <ScreenshotOverlay />
    <TimestampsPanel />
    <PreferencesDialog />
    <EditEpisodeDialog />
    <LoginDialog />
  </div>
</template>

<script lang="ts" setup>
import { useTimeout } from '@anime-skip/ui';
import { PLAYER_ACTIVITY_TIMEOUT } from '~/common/utils/Constants';
import { nextFrame } from '~/common/utils/EventLoop';
import Messenger from '~/common/utils/Messenger';
import UsageStats from '~/common/utils/UsageStats';
import Utils from '~/common/utils/Utils';
import { useLoadAllEpisodeData } from '../hooks/useLoadAllEpisodeData';
import { usePlaybackRateConnector } from '../hooks/usePlaybackRateConnector';
import { useTabUrl } from '../hooks/useTabUrl';
import { useVideoElement } from '../hooks/useVideoElement';
import { useHidePlayer, useIsPlayerHidden, useShowPlayer } from '../state/usePlayerVisibility';
import {
  usePlayHistory,
  useResetInitialBuffer,
  useResetSkippedFromZero,
} from '../state/usePlayHistory';
import { useVideoState } from '../state/useVideoState';

onMounted(() => {
  void UsageStats.saveEvent('player_injected');
});

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

onMounted(() => {
  Utils.waitForVideoLoad().then(setDuration);
});

// Hover Activity

const videoState = useVideoState();

const [setActiveTimeout, clearActiveTimeout] = useTimeout();
const isActive = computed(() => videoState.isActive);
function onMouseEnter() {
  setupContextMenu();
  onMouseMove();
}
function onMouseLeave() {
  removeContextMenu();
  clearActiveTimeout();
  setInactive();
}
function onMouseMove() {
  setActive();
  setActiveTimeout(setInactive, PLAYER_ACTIVITY_TIMEOUT);
}
function setupContextMenu() {
  messenger.send('@anime-skip/setup-context-menu', undefined);
}
function removeContextMenu() {
  messenger.send('@anime-skip/remove-context-menu', undefined);
}

// Display flags

const playHistory = usePlayHistory();

const isEpisodeInfoShowing = computed<boolean>(
  () => videoState.isPaused || (videoState.isBuffering && playHistory.isInitialBuffer)
);
const showBufferLoading = computed<boolean>(() => videoState.isBuffering && !videoState.isPaused);

const showPlayer = useShowPlayer();
const hidePlayer = useHidePlayer();

const messenger = new Messenger('player', {
  '@anime-skip/start-screenshot': async () => {
    hidePlayer();
    // Wait for player to re-render as hidden before contiuing the screenshot process
    await nextFrame();
  },
  '@anime-skip/stop-screenshot': async () => showPlayer(),
});

const isHidden = useIsPlayerHidden();
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
