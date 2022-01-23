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
      <div class="as-left-content as-pointer-events-none as-pl-8 as-pt-8 as-box-border">
        <episode-info />
      </div>
      <notification-center class="as-right-content" />
      <controls-toolbar class="as-bottom-content" />

      <!-- Dialogs -->
      <ScreenshotOverlay />
      <TimestampsPanel />
      <PreferencesDialog />
      <EditEpisodeDialog />
      <LoginDialog />
    </div>
    <return-button />
  </ScopedStylesRoot>
</template>

<script lang="ts" setup>
import { useTimeout } from '@anime-skip/ui';
import { PLAYER_ACTIVITY_TIMEOUT } from '~/common/utils/constants';
import { nextFrame } from '~/common/utils/event-loop';
import Utils from '~/common/utils/GeneralUtils';
import Messenger from '~/common/utils/Messenger';
import UsageStats from '~/common/utils/UsageStats';
import { useLoadAllEpisodeData } from '../hooks/useLoadAllEpisodeData';
import { usePlaybackRateConnector } from '../hooks/usePlaybackRateConnector';
import { useTabUrl } from '../hooks/useTabUrl';
import { useTheme } from '../hooks/useTheme';
import { useVideoElement } from '../hooks/useVideoElement';
import {
  useHideAnimeSkipPlayer,
  useIsAnimeSkipPlayerVisible,
  useIsOriginalPlayerVisible,
  useShowAnimeSkipPlayer,
} from '../state/usePlayerVisibility';
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
  clearActiveTimeout();
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

const showPlayer = useShowAnimeSkipPlayer();
const hidePlayer = useHideAnimeSkipPlayer();
const isPlayerVisible = useIsAnimeSkipPlayerVisible();
const isOriginalPlayerVisible = useIsOriginalPlayerVisible();

const messenger = new Messenger('player', {
  '@anime-skip/start-screenshot': async () => {
    hidePlayer();
    // Wait for player to re-render as hidden before continuing the screenshot process
    await nextFrame();
  },
  '@anime-skip/stop-screenshot': async () => showPlayer(),
});

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
}
</style>
