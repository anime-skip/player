<template>
  <ScopedStylesRoot>
    <div
      v-if="!playerVisibility.serviceUi"
      id="AnimeSkipPlayer"
      class="as-absolute as-inset-0 as-grid as-overflow-hidden as-bg-background as-bg-opacity-0"
      :class="{
        'as-active': activity.isActive,
        'as-paused as-bg-opacity-medium': videoState.paused,
        'as-buffering as-bg-opacity-medium': showBufferLoading,
        'as-showing': isEpisodeInfoShowing,
        'as-opacity-0': !playerVisibility.animeSkipUi,
        [themeClass]: true,
      }"
      @mouseenter.prevent="onMouseEnter"
      @mousemove.prevent="onMouseMove"
      @mouseleave.prevent="onMouseLeave"
      @click="videoState.togglePlayPause()"
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
      <!-- <screenshot-controller
        :mouse-over="mouseOver"
        :show-player="(playerVisibility.animeSkipUi = true)"
        :hide-player="(playerVisibility.animeSkipUi = false)"
      /> -->
      <TimestampsPanel />
      <PreferencesDialog />
      <ConnectEpisodeDialog />
      <LoginDialog />
    </div>
    <return-button />
  </ScopedStylesRoot>
</template>

<script lang="ts" setup>
import { useTheme } from '../composables/useTheme';
import { DialogName, useDialogStore } from '../stores/useDialogStore';
import { usePlayHistoryStore } from '../stores/usePlayHistoryStore';
import { useUserActivityStore } from '../stores/useUserActivityStore';
import { useVideoStateStore } from '../stores/useVideoStateStore';
import { usePlayerVisibilityStore } from '../stores/usePlayerVisibilityStore';
import { useMouseActivity } from '../composables/useMouseActivity';

const dialogs = useDialogStore();
const isTimestampsPanelOpen = computed(() => dialogs.activeDialog === DialogName.TIMESTAMPS_PANEL);
const isPreferencesDialogOpen = computed(() => dialogs.activeDialog === DialogName.PREFERENCES);

const playHistory = usePlayHistoryStore();

const videoState = useVideoStateStore();
const activity = useUserActivityStore();

// Hover Activity

const { onMouseEnter, onMouseLeave, onMouseMove } = useMouseActivity();

// Display flags

const isEpisodeInfoShowing = computed<boolean>(() => videoState.paused || videoState.waiting);
const showBufferLoading = computed<boolean>(() => videoState.stalled || videoState.waiting);

const playerVisibility = usePlayerVisibilityStore();

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
