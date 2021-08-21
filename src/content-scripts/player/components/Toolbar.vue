<template>
  <div
    class="ToolBar relative cursor-default"
    :class="{
      active: showToolbar,
      paused: videoState.isPaused,
      'hide-timeline-when-minimized': fullyHideToolbar,
    }"
    @click.stop
  >
    <TimelineWrapper
      class="timeline-alignment"
      :class="{ 'opacity-0 pointer-events-none': !hasDuration }"
      :is-flipped="!showToolbar"
      :duration="videoState.duration"
    />
    <div class="h-toolbar flex flex-row items-center space-x-1 px-2 pt-0.5">
      <ToolbarButton @click="togglePlayPause()">
        <PlayPauseButton :state="playAnimationState" />
      </ToolbarButton>
      <ToolbarButton
        v-if="hasTimestamps"
        icon="M11 18V6L2.5 12L11 18ZM11.5 12L20 18V6L11.5 12Z"
        @click="gotoPreviousTimestamp()"
      />
      <ToolbarButton
        v-if="hasTimestamps"
        icon="M4 18L12.5 12L4 6V18ZM13 6V18L21.5 12L13 6Z"
        @click="gotoNextTimestamp()"
      />
      <VolumeButton />
      <p class="body-2">{{ formattedTime }} / {{ formattedDuration }}</p>
      <div class="flex-1" />
      <ToolbarButton icon="ic_timestamps.svg" title="Timestamps" @click="toggleTimestampsDialog" />
      <ToolbarButton
        v-if="canSaveEdits"
        icon="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"
        title="Save Changes"
        @click="saveChanges()"
      />
      <ToolbarButton
        class=""
        icon="M12 8C13.1 8 14 7.1 14 6C14 4.9 13.1 4 12 4C10.9 4 10 4.9 10 6C10 7.1 10.9 8 12 8ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10ZM12 16C10.9 16 10 16.9 10 18C10 19.1 10.9 20 12 20C13.1 20 14 19.1 14 18C14 16.9 13.1 16 12 16Z"
        @click="togglePreferencesDialog"
      />
      <ToolbarButton v-if="isFullscreenEnabled" @click="toggleFullscreen()">
        <FullscreenButton :state="fullscreenAnimationState" />
      </ToolbarButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Utils as UiUtils } from '@anime-skip/ui';
import { useFullscreen } from '@vueuse/core';
import { FRAME } from '~/common/utils/Constants';
import Utils from '~/common/utils/Utils';
import { useDisplayedTimestamps } from '../hooks/useDisplayedTimestamps';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { useHideDialog, useShowDialog, useToggleDialog } from '../state/useDialogState';
import {
  EditTimestampMode,
  useEditingState,
  useSetActiveTimestamp,
  useSetEditTimestampMode,
  useUpdateEditingState,
} from '../state/useEditingState';
import { useVideoController, useVideoState } from '../state/useVideoState';

// TODO: Inject video state, remove from props

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

const duration = computed(() => videoState.duration);
const hasDuration = computed(() => !videoState.duration);
const formattedDuration = computed<string>(() =>
  !hasDuration.value ? 'Loading...' : UiUtils.formatSeconds(videoState.duration, false)
);

// Preferences

// TODO: use preferences directly
const hideTimelineWhenMinimized = ref(false);
// TODO: use preferences directly
const minimizeToolbarWhenEditing = ref(false);
//     const hideTimelineWhenMinimized = computed<boolean>(
//       () => !!store.getters[GetterTypes.PREFERENCES]?.hideTimelineWhenMinimized
//     );
//     const minimizeToolbarWhenEditing = computed<boolean>(
//       () => !!store.getters[GetterTypes.PREFERENCES]?.minimizeToolbarWhenEditing
//     );

// Editing

const editingState = useEditingState();
const updateEditing = useUpdateEditingState();
const isEditing = computed(() => editingState.isEditing);
const isSaving = computed(() => editingState.isSaving);
const canSaveEdits = computed(() => editingState.isEditing && !editingState.isSaving);
const showToolbar = computed(
  () => videoState.isActive || (isEditing.value && !minimizeToolbarWhenEditing.value)
);
const fullyHideToolbar = computed(
  () => !videoState.isActive && !videoState.isPaused && hideTimelineWhenMinimized.value
);
const setEditTimestampMode = useSetEditTimestampMode();

// Button Animations

const playAnimationState = computed<1 | 0>(() => (isPaused.value ? 1 : 0));

const isFullscreenEnabled = ref(document.fullscreenEnabled);
const { isFullscreen, toggle: toggleFullscreen } = useFullscreen(); // TODO: `document.fullscreenElement` for first param?
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
const setActiveTimestamp = useSetActiveTimestamp();

// Keyboard Shortcuts

function createNewTimestamp(): void {
  // TODO
  // store.dispatch(ActionTypes.CREATE_NEW_TIMESTAMP, undefined);
}

function saveChanges(discard = false): void {
  // TODO
  // store.dispatch(ActionTypes.STOP_EDITING, discard);
}

function editTimestampOnJump(timestamp: Api.AmbiguousTimestamp): void {
  pause();
  setActiveTimestamp(timestamp);
  setEditTimestampMode(EditTimestampMode.EDIT);
  showDialog('TimestampsPanel');
}

function gotoNextTimestamp(): void {
  const nextTimestamp = Utils.nextTimestamp(currentTime.value + 0.1, timestamps.value, undefined);
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

  console.warn(
    'Tried to go to next timestamp, but there was not one and the duration had not been initalized'
  );
}

function gotoPreviousTimestamp(): void {
  const previousTimestamp = Utils.previousTimestamp(currentTime.value, timestamps.value, undefined);
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
// const addMissingDurations = (missingDuration: number) => {
//   store.dispatch(ActionTypes.ADD_MISSING_DURATIONS, missingDuration);
// };
// const updateDuration = (newDuration: number) => {
//   setDuration(newDuration);
//   if (newDuration === 0) {
//     displayDuration.value = 'Loading...';
//   } else {
//     displayDuration.value = Utils.formatSeconds(newDuration, false);
//   }
//   addMissingDurations(newDuration);
// };
</script>

<style lang="scss" scoped>
@import '../utils/constants.scss';
@import '@anime-skip/ui/variables-theme.scss';

.h-toolbar {
  height: $toolbarHeight;
}

.ToolBar {
  transform: translateY($toolbarHeight + 1px);
  transition: 200ms;
  transition-property: transform;
  user-select: none;

  &.hide-timeline-when-minimized {
    transform: translateY($toolbarHeight + 6px);
  }

  &.active,
  &.paused {
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
    opacity: 0;
    background: linear-gradient(
      transparent,
      rgba($color: $backgroundColor-background, $alpha: $opacity-medium)
    );
  }
  &.active {
    &::before {
      opacity: 1;
    }
  }
  &.paused {
    &::before {
      opacity: 0;
    }
  }

  .timeline-alignment {
    // Line bottom of background with top of buttons
    margin-bottom: -2px;
  }
}
</style>
