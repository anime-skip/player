<template>
  <div
    class="ToolBar as-relative as-cursor-default"
    :class="{
      'as-active': isToolbarVisible,
      'as-paused': videoState.isPaused,
      'as-hide-timeline-when-minimized': fullyHideToolbar,
    }"
    @click.stop
  >
    <TimelineWrapper
      class="as-timeline-alignment"
      :class="{ 'as-opacity-0 as-pointer-events-none': !hasDuration }"
      :is-flipped="!isToolbarVisible && !videoState.isPaused"
    />
    <div class="as-h-toolbar as-flex as-flex-row as-items-center as-space-x-1 as-px-2 as-pt-0.5">
      <ToolbarButton @click="togglePlayPause()">
        <PlayPauseButton :state="playAnimationState" />
      </ToolbarButton>
      <ToolbarButton v-if="hasTimestamps" @click="gotoPreviousTimestamp()">
        <i-mdi-rewind class="as-w-6 as-h-6" />
      </ToolbarButton>
      <ToolbarButton v-if="hasTimestamps" @click="gotoNextTimestamp()">
        <i-mdi-fast-forward class="as-w-6 as-h-6" />
      </ToolbarButton>
      <VolumeButton />
      <p class="as-body-2">{{ formattedTime }} / {{ formattedDuration }}</p>
      <div class="as-flex-1" />
      <ToolbarButton title="Timestamps" @click="toggleTimestampsDialog">
        <i-fe-timeline class="as-w-6 as-h-6 as-inline" />
      </ToolbarButton>
      <ToolbarButton v-if="canSaveEdits" title="Save Changes" @click="saveChanges()">
        <i-mdi-content-save class="as-w-6 as-h-6 as-inline" />
      </ToolbarButton>
      <ToolbarButton @click="togglePreferencesDialog">
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
import { usePlayerConfig } from '~/composables/usePlayerConfig';
import { useCreateNewTimestamp } from '~/composables/useCreateNewTimestamp';
import { useDisplayedTimestamps } from '~/composables/useDisplayedTimestamps';
import { useIsToolbarVisible } from '~/composables/useIsToolbarVisible';
import { useKeyboardShortcuts } from '~/composables/useKeyboardShortcuts';
import { useStopEditing } from '~/composables/useStopEditing';
import { useHideDialog, useShowDialog, useToggleDialog } from '~/stores/useDialogState';
import {
  EditTimestampMode,
  useEditingState,
  useIsEditing,
  useUpdateActiveTimestamp,
  useUpdateEditTimestampMode,
} from '~/stores/useEditingState';
import { useGeneralPreferences } from '~/stores/useGeneralPreferences';
import { useDuration, useVideoController, useVideoState } from '~/stores/useVideoState';
import { FRAME, LOOKUP_PREV_TIMESTAMP_OFFSET } from '~/utils/constants';
import { warn } from '~/utils/log';
import * as Api from '~api';
import Utils from '~utils/GeneralUtils';

// Video State

const videoState = useVideoState();
const { setCurrentTime, pause, togglePlayPause } = useVideoController();

function addTime(seconds: number) {
  setCurrentTime(videoState.currentTime + seconds);
}

const isPaused = computed(() => videoState.isPaused);
const currentTime = computed(() => videoState.currentTime);
const showDecimalsInFormattedTime = computed(() => isPaused.value);
const formattedTime = computed(() =>
  UiUtils.formatSeconds(currentTime.value, showDecimalsInFormattedTime.value)
);

const duration = useDuration(videoState);
const hasDuration = computed(() => !!duration.value);
const formattedDuration = computed<string>(() =>
  videoState.duration ? UiUtils.formatSeconds(videoState.duration, false) : 'Loading...'
);

// Preferences

const preferences = useGeneralPreferences();
const hideTimelineWhenMinimized = computed(() => preferences.value.hideTimelineWhenMinimized);
const minimizeToolbarWhenEditing = computed(() => preferences.value.minimizeToolbarWhenEditing);

// Editing

const editingState = useEditingState();
const isEditing = useIsEditing(editingState);
const canSaveEdits = computed(() => editingState.isEditing && !editingState.isSaving);
const isToolbarVisible = useIsToolbarVisible();
const fullyHideToolbar = computed(
  () => !videoState.isActive && !videoState.isPaused && hideTimelineWhenMinimized.value
);
const setEditTimestampMode = useUpdateEditTimestampMode();

// Button Animations

const playAnimationState = computed<1 | 0>(() => (isPaused.value ? 1 : 0));

const playerConfig = usePlayerConfig();
const isFullscreenEnabled = ref(document.fullscreenEnabled);
const { isFullscreen, toggle: toggleFullscreen } = useFullscreen(
  document.querySelector<HTMLElement>(playerConfig.getRootQuery())
);
const fullscreenAnimationState = computed<1 | 0>(() => (isFullscreen.value ? 0 : 1));

// Dialogs

const showDialog = useShowDialog();
const hideDialog = useHideDialog();
const toggleDialog = useToggleDialog();
function togglePreferencesDialog(): void {
  toggleDialog('PreferencesDialog');
}
function toggleTimestampsDialog(): void {
  toggleDialog('TimestampsPanel');
}

// Timestamps

const timestamps = useDisplayedTimestamps();
const hasTimestamps = computed(() => timestamps.value.length > 0);
const activeTimestamp = computed(() => editingState.activeTimestamp);
const updateActiveTimestamp = useUpdateActiveTimestamp();

// Keyboard Shortcuts

const createNewTimestamp = useCreateNewTimestamp();

const saveChanges = useStopEditing();

function editTimestampOnJump(timestamp: Api.AmbiguousTimestamp): void {
  pause();
  updateActiveTimestamp(timestamp);
  setEditTimestampMode(EditTimestampMode.EDIT);
  showDialog('TimestampsPanel');
}

function gotoNextTimestamp(): void {
  const nextTimestamp = Utils.nextTimestampInVideo(currentTime.value + 0.1, timestamps.value);
  if (nextTimestamp) {
    setCurrentTime(nextTimestamp.at);
    if (isEditing.value) editTimestampOnJump(nextTimestamp);
    return;
  }

  const end = duration.value;
  if (end) {
    setCurrentTime(end);
    return;
  }

  warn(
    'Tried to go to next timestamp, but there was not one and the duration had not been initalized'
  );
}

function gotoPreviousTimestamp(): void {
  const previousTimestamp = Utils.previousTimestampInVideo(
    currentTime.value - LOOKUP_PREV_TIMESTAMP_OFFSET,
    timestamps.value
  );
  if (previousTimestamp) {
    setCurrentTime(previousTimestamp.at);
    if (isEditing.value) editTimestampOnJump(previousTimestamp);
    return;
  }

  setCurrentTime(0);
}

const INCREMENT_SMALL = 2;
const INCREMENT_MEDIUM = 5;
const INCREMENT_LARGE = 90;

useKeyboardShortcuts('toolbar', {
  playPause: togglePlayPause,
  toggleFullscreen,
  hideDialog,
  nextTimestamp: gotoNextTimestamp,
  previousTimestamp: gotoPreviousTimestamp,
  advanceFrame: () => addTime(FRAME),
  advanceSmall: () => addTime(INCREMENT_SMALL),
  advanceMedium: () => addTime(INCREMENT_MEDIUM),
  advanceLarge: () => addTime(INCREMENT_LARGE),
  rewindFrame: () => addTime(-FRAME),
  rewindSmall: () => addTime(-INCREMENT_SMALL),
  rewindMedium: () => addTime(-INCREMENT_MEDIUM),
  rewindLarge: () => addTime(-INCREMENT_LARGE),
  createTimestamp() {
    if (activeTimestamp.value != null) return;
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

// Data Maintainence

// TODO: Fix missing durations, then require it
// SELECT * FROM episodes WHERE duration IS NULL;
// SELECT * FROM episodes WHERE base_duration IS NULL;
</script>

<style lang="scss" scoped>
@import '../utils/constants.scss';

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
