<template>
  <div
    class="ToolBar as-relative as-cursor-default"
    :class="{
      'as-active': isToolbarVisible,
      'as-paused': !videoState.playing,
      'as-hide-timeline-when-minimized': fullyHideToolbar,
    }"
    @click.stop
  >
    <TimelineWrapper
      class="as-timeline-alignment"
      :class="{ 'as-opacity-0 as-pointer-events-none': !hasDuration }"
      :is-flipped="!isToolbarVisible && videoState.playing"
    />
    <div class="as-h-toolbar as-flex as-flex-row as-items-center as-space-x-1 as-px-2 as-pt-0.5">
      <ToolbarButton @click="videoState.togglePlayPause()">
        <PlayPauseButton :state="playAnimationState" />
      </ToolbarButton>
      <ToolbarButton v-if="hasTimestamps" @click="gotoPreviousTimestamp()">
        <i-mdi-rewind class="as-w-6 as-h-6" />
      </ToolbarButton>
      <ToolbarButton v-if="hasTimestamps" @click="gotoNextTimestamp()">
        <i-mdi-fast-forward class="as-w-6 as-h-6" />
      </ToolbarButton>
      <VolumeButton />
      <p class="as-body-2">{{ currentFormattedTime }} / {{ formattedDuration }}</p>
      <div class="as-flex-1" />
      <ToolbarButton title="Timestamps" @click="dialogs.toggleDialog(DialogName.TIMESTAMPS_PANEL)">
        <i-fe-timeline class="as-w-6 as-h-6 as-inline" />
      </ToolbarButton>
      <ToolbarButton v-if="canSaveEdits" title="Save Changes" @click="saveChanges()">
        <i-mdi-content-save class="as-w-6 as-h-6 as-inline" />
      </ToolbarButton>
      <ToolbarButton @click="dialogs.toggleDialog(DialogName.PREFERENCES)">
        <i-mdi-dots-vertical class="as-w-6 as-h-6" />
      </ToolbarButton>
      <ToolbarButton v-if="isFullscreenEnabled" @click="toggleFullscreen()">
        <FullscreenButton :state="fullscreenAnimationState" />
      </ToolbarButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Utils as UiUtils } from '@anime-skip/ui';
import { useFullscreen } from '@vueuse/core';
import { usePlayerConfig } from '../composables/usePlayerConfig';
import { useCreateNewTimestamp } from '../composables/useCreateNewTimestamp';
import { useDisplayedTimestamps } from '../composables/useDisplayedTimestamps';
import { useIsToolbarVisible } from '../composables/useIsToolbarVisible';
import { useKeyboardShortcuts } from '../composables/useKeyboardShortcuts';
import { useStopEditing } from '../composables/useStopEditing';
import { FRAME, LOOKUP_PREV_TIMESTAMP_OFFSET } from '../utils/constants';
import { log, warn } from '../utils/log';
import * as Api from 'common/src/api';
import Utils from 'common/src/utils/GeneralUtils';
import { useVideoStateStore } from '../state/stores/useVideoStateStore';
import { usePreferencesStore } from '../state/stores/usePreferencesStore';
import { storeToRefs } from 'pinia';
import {
  EditTimestampMode,
  useTimestampEditingStore,
} from '../state/stores/useTimestampEditingStore';
import { useUserActivityStore } from '../state/stores/useUserActivityStore';
import { DialogName, useDialogStore } from '../state/stores/useDialogStore';
import { useFocusedTimestampStore } from '../state/stores/useFocusedTimestampStore';

const videoState = useVideoStateStore();
const editing = useTimestampEditingStore();
const prefsStore = usePreferencesStore();
const { preferences } = storeToRefs(prefsStore);
const activity = useUserActivityStore();
const dialogs = useDialogStore();
const focusedTimestamp = useFocusedTimestampStore();

// Video State

const showDecimalsInFormattedTime = computed(() => !videoState.playing);
const currentFormattedTime = computed(() =>
  UiUtils.formatSeconds(videoState.currentTime, showDecimalsInFormattedTime.value)
);

const hasDuration = computed(() => !!videoState.duration);
const formattedDuration = computed<string>(() =>
  videoState.duration ? UiUtils.formatSeconds(videoState.duration, false) : 'Loading...'
);

// Editing

const canSaveEdits = computed(() => editing.isEditing && !editing.isSaving);
const isToolbarVisible = useIsToolbarVisible();
const fullyHideToolbar = computed(
  () => !isToolbarVisible.value && preferences.value.hideTimelineWhenMinimized
);

// Button Animations

const playAnimationState = computed<1 | 0>(() => (!videoState.playing ? 1 : 0));

const playerConfig = usePlayerConfig();
const isFullscreenEnabled = ref(document.fullscreenEnabled);
const { isFullscreen, toggle: toggleFullscreen } = useFullscreen(
  document.querySelector<HTMLElement>(playerConfig.getRootQuery())
);
const fullscreenAnimationState = computed<1 | 0>(() => (isFullscreen.value ? 0 : 1));

// Timestamps

const timestamps = useDisplayedTimestamps();
const hasTimestamps = computed(() => timestamps.value.length > 0);

// Keyboard Shortcuts

const createNewTimestamp = useCreateNewTimestamp();

const saveChanges = useStopEditing();

function editTimestampOnJump(timestamp: Api.AmbiguousTimestamp): void {
  videoState.pause();
  focusedTimestamp.timestamp = timestamp;
  editing.editTimestampMode = EditTimestampMode.EDIT;
  dialogs.showDialog(DialogName.TIMESTAMPS_PANEL);
}

function gotoNextTimestamp(): void {
  const nextTimestamp = Utils.nextTimestampInVideo(videoState.currentTime + 0.1, timestamps.value);
  if (nextTimestamp) {
    videoState.seekTo(nextTimestamp.at);
    if (editing.isEditing) editTimestampOnJump(nextTimestamp);
    return;
  }

  const end = videoState.duration;
  if (end) {
    videoState.seekTo(end);
    return;
  }

  warn(
    'Tried to go to next timestamp, but there was not one and the duration had not been initialized'
  );
}

function gotoPreviousTimestamp(): void {
  const previousTimestamp = Utils.previousTimestampInVideo(
    videoState.currentTime - LOOKUP_PREV_TIMESTAMP_OFFSET,
    timestamps.value
  );
  if (!previousTimestamp) return videoState.seekTo(0);

  videoState.seekTo(previousTimestamp.at);
  if (editing.isEditing) editTimestampOnJump(previousTimestamp);
}

const INCREMENT_SMALL = 2;
const INCREMENT_MEDIUM = 5;
const INCREMENT_LARGE = 90;

useKeyboardShortcuts('toolbar', {
  playPause: () => videoState.togglePlayPause(),
  toggleFullscreen,
  hideDialog: () => {
    dialogs.hideDialog();
    dialogs.hideLoginOverlay();
  },
  nextTimestamp: gotoNextTimestamp,
  previousTimestamp: gotoPreviousTimestamp,
  advanceFrame: () => videoState.fastForward(FRAME),
  advanceSmall: () => videoState.fastForward(INCREMENT_SMALL),
  advanceMedium: () => videoState.fastForward(INCREMENT_MEDIUM),
  advanceLarge: () => videoState.fastForward(INCREMENT_LARGE),
  rewindFrame: () => videoState.rewind(FRAME),
  rewindSmall: () => videoState.rewind(INCREMENT_SMALL),
  rewindMedium: () => videoState.rewind(INCREMENT_MEDIUM),
  rewindLarge: () => videoState.rewind(INCREMENT_LARGE),
  createTimestamp() {
    if (editing.activeTimestamp != null) return;
    createNewTimestamp();
  },
  saveTimestamps() {
    if (!canSaveEdits.value) return;
    saveChanges();
  },
  discardChanges() {
    if (!canSaveEdits.value) return;
    saveChanges(true);
  },
});

// Data Maintenance

// TODO: Fix missing durations, then require it
// SELECT * FROM episodes WHERE duration IS NULL;
// SELECT * FROM episodes WHERE base_duration IS NULL;
</script>

<style lang="scss" scoped>
@import '../assets/constants.scss';

.as-h-toolbar {
  height: $toolbarHeight;
}

.ToolBar {
  transform: translateY($toolbarHeight + 1px);
  transition: 200ms;
  transition-property: transform;
  user-select: none;

  &.as-hide-timeline-when-minimized {
    transform: translateY($toolbarHeight + 8px);
  }

  &.as-active,
  &.as-paused {
    transform: translateY(0px);
  }

  &::before {
    content: '';
    z-index: -1;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 64px;
    transition: 200ms;
    transition-property: opacity;
    @apply as-opacity-0 as-bg-gradient-to-b as-from-transparent as-to-background;
  }
  &.as-active::before {
    @apply as-opacity-medium;
  }
  &.as-paused::before {
    @apply as-opacity-0;
  }

  .as-timeline-alignment {
    // Line bottom of background with top of buttons
    margin-bottom: -2px;
  }
}
</style>
