<template>
  <div
    class="ToolBar relative cursor-default"
    :class="{
      active: isActive,
      paused: playerState.isPaused,
    }"
    @click.stop
  >
    <TimelineWrapper
      class="timeline-alignment"
      :class="{ 'opacity-0 pointer-events-none': !duration }"
      :is-flipped="!playerState.isPaused && !isActive"
      :duration="duration"
    />
    <div class="h-toolbar flex flex-row items-center space-x-1 px-2 pt-0.5">
      <ToolbarButton @click="togglePlayPause()">
        <PlayPauseButton :state="playPauseState" />
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
      <p class="body-2">{{ formattedTime }} / {{ displayDuration }}</p>
      <div class="flex-1" />
      <ToolbarButton icon="ic_timestamps.svg" title="Timestamps" @click="toggleTimestampsDialog" />
      <ToolbarButton
        v-if="isSaveTimestampsAvailable"
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
        <FullscreenButton :state="fullscreenState" :key="isFullscreenCount" />
      </ToolbarButton>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import TimelineWrapper from './TimelineWrapper.vue';
import ToolbarButton from './ToolbarButton.vue';
import PlayPauseButton from './animations/PlayPauseButton.vue';
import FullscreenButton from './animations/FullscreenButton.vue';
import VolumeButton from './animations/VolumeButton.vue';
import Utils from '@/common/utils/Utils';
import { useVideoController } from '@/common/mixins/VideoController';
import { useKeyboardShortcuts } from '@/common/mixins/KeyboardShortcuts';
import { FRAME } from '@/common/utils/Constants';
import { MutationTypes } from '@/common/store/mutationTypes';
import { ActionTypes } from '@/common/store/actionTypes';
import { GetterTypes } from '@/common/store/getterTypes';
import { useStore } from 'vuex';
import { Store } from '@/common/store';
import useFormattedTime from '@/common/composition/formattedTime';

export default defineComponent({
  name: 'Toolbar',
  components: {
    TimelineWrapper,
    PlayPauseButton,
    ToolbarButton,
    FullscreenButton,
    VolumeButton,
  },
  setup() {
    const store: Store = useStore();
    const { setCurrentTime, pause, togglePlayPause, addTime, getVideo } = useVideoController();

    // Editing
    const playerState = computed(() => store.state.playerState);
    const isEditing = computed(() => store.state.isEditing);
    const isSavingTimestamps = computed(() => store.getters[GetterTypes.IS_SAVING_TIMESTAMPS]);
    const isSaveTimestampsAvailable = computed(() => isEditing.value && !isSavingTimestamps.value);
    const isPaused = computed<boolean>(() => playerState.value.isPaused);

    const currentTime = computed(() => store.state.playerState.currentTime);
    const isActive = computed(() => playerState.value.isActive || isEditing.value);
    const formattedTime = useFormattedTime(currentTime, isPaused);

    // Play button
    const playPauseState = computed<1 | 0>(() => (isPaused.value ? 1 : 0));

    // Duration
    const displayDuration = ref('Loading...');
    const duration = computed(() => store.getters[GetterTypes.DURATION]);

    // Full screen button
    const isFullscreen = ref(Utils.isFullscreen());
    const isFullscreenCount = ref(0);
    const isFullscreenEnabled = ref(document.fullscreenEnabled);
    const fullscreenState = computed<1 | 0>(() => (isFullscreen.value ? 0 : 1));

    // Timestamps
    const activeTimestamp = computed(() => store.state.activeTimestamp);
    const timestamps = computed(() => store.getters[GetterTypes.ACTIVE_TIMESTAMPS]);
    const hasTimestamps = computed(() => timestamps.value.length > 0);

    // Dialogs
    const showDialog = (dialog?: string): void => {
      store.dispatch(ActionTypes.SHOW_DIALOG, dialog);
    };
    const togglePreferencesDialog = (): void => {
      showDialog(
        store.state.activeDialog === 'PreferencesDialog' ? undefined : 'PreferencesDialog'
      );
    };
    const toggleTimestampsDialog = (): void => {
      showDialog(store.state.activeDialog === 'TimestampsPanel' ? undefined : 'TimestampsPanel');
    };

    const setActiveTimestamp = (timestamp: Api.AmbiguousTimestamp): void => {
      store.commit(MutationTypes.SET_ACTIVE_TIMESTAMP, timestamp);
    };
    const setEditTimestampMode = (mode: 'add' | 'edit' | undefined): void => {
      store.commit(MutationTypes.SET_EDIT_TIMESTAMP_MODE, mode);
    };
    const setDuration = (newDuration?: number): void => {
      store.commit(MutationTypes.SET_DURATION, newDuration);
    };
    const createNewTimestamp = async (): Promise<void> => {
      store.dispatch(ActionTypes.CREATE_NEW_TIMESTAMP, undefined);
    };
    const addMissingDurations = (missingDuration: number) => {
      store.dispatch(ActionTypes.ADD_MISSING_DURATIONS, missingDuration);
    };
    const saveChanges = (discard?: boolean) => {
      store.dispatch(ActionTypes.STOP_EDITING, discard);
    };
    const toggleFullscreen = (): void => {
      isFullscreen.value = !Utils.isFullscreen();
      if (isFullscreen.value) {
        Utils.enterFullscreen();
      } else {
        Utils.exitFullscreen();
      }
    };
    const updateDuration = (newDuration: number) => {
      setDuration(newDuration);
      if (newDuration === 0) {
        displayDuration.value = 'Loading...';
      } else {
        displayDuration.value = Utils.formatSeconds(newDuration, false);
      }
      addMissingDurations(newDuration);
    };
    const gotoNextTimestamp = (): void => {
      const nextTimestamp = Utils.nextTimestamp(
        currentTime.value + 0.1,
        timestamps.value,
        undefined
      );
      const video = getVideo();
      if (nextTimestamp) {
        setCurrentTime(nextTimestamp.at);
        if (isEditing.value) {
          pause();
          setActiveTimestamp(nextTimestamp);
          setEditTimestampMode('edit');
          showDialog('TimestampsPanel');
        }
      } else if (video.duration) {
        setCurrentTime(video.duration);
      } else {
        console.warn(
          'Tried to go to next timestamp, but there was not one and the duration had not been initalized'
        );
      }
    };
    const gotoPreviousTimestamp = (): void => {
      const previousTimestamp = Utils.previousTimestamp(
        currentTime.value,
        timestamps.value,
        undefined
      );
      if (previousTimestamp) {
        setCurrentTime(previousTimestamp.at);
        if (isEditing.value) {
          pause();
          setActiveTimestamp(previousTimestamp);
          setEditTimestampMode('edit');
          showDialog('TimestampsPanel');
        }
      } else {
        setCurrentTime(0);
      }
    };
    useKeyboardShortcuts('Toolbar', store, {
      // General Controls
      playPause: () => togglePlayPause(),
      toggleFullscreen: () => toggleFullscreen(),
      hideDialog: showDialog,
      nextTimestamp: () => gotoNextTimestamp(),
      previousTimestamp: () => gotoPreviousTimestamp(),
      // Advance Time
      advanceFrame: () => addTime(FRAME),
      advanceSmall: () => addTime(2),
      advanceMedium: () => addTime(5),
      advanceLarge: () => addTime(90),
      // Rewind Time
      rewindFrame: () => addTime(-FRAME),
      rewindSmall: () => addTime(-2),
      rewindMedium: () => addTime(-5),
      rewindLarge: () => addTime(-85),
      // Editing
      createTimestamp: () => {
        if (activeTimestamp.value == null) {
          createNewTimestamp();
        }
      },
      saveTimestamps: () => {
        if (!isSaveTimestampsAvailable.value) return;
        saveChanges();
      },
      discardChanges: () => {
        if (!isSaveTimestampsAvailable.value) return;
        saveChanges(true);
      },
    });

    // Lifecycle
    global.onVideoChanged(video => {
      video.addEventListener('durationchange', (event: Event) => {
        updateDuration((event.target as HTMLVideoElement).duration);
      });
      setCurrentTime(video.currentTime, false);
      video.ontimeupdate = () => {
        setCurrentTime(video.currentTime, false);
      };
    });
    document.addEventListener('fullscreenchange', () => {
      isFullscreen.value = Utils.isFullscreen();
      isFullscreenCount.value++;
    });
    Utils.waitForVideoLoad().then(updateDuration);

    return {
      currentTime,
      isFullscreen,
      isFullscreenCount,
      displayDuration,
      isFullscreenEnabled,
      togglePreferencesDialog,
      toggleTimestampsDialog,
      playPauseState,
      fullscreenState,
      isSaveTimestampsAvailable,
      isActive,
      duration,
      hasTimestamps,
      saveChanges,
      toggleFullscreen,
      togglePlayPause,
      formattedTime,
      gotoPreviousTimestamp,
      gotoNextTimestamp,
      playerState,
    };
  },
});
</script>

<style lang="scss" scoped>
@import '../../common/css/constants.scss';
@import '@anime-skip/ui/theme.scss';

.h-toolbar {
  height: $toolbarHeight;
}

.ToolBar {
  transform: translateY($toolbarHeight + 1px);
  transition: 200ms;
  transition-property: transform;
  user-select: none;

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
