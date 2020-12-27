<template>
  <div
    class="ToolBar"
    :class="{
      active: isActive,
      paused: playerState.isPaused,
    }"
    @click.stop
  >
    <Timeline
      class="timeline"
      :class="{ 'timeline-hidden': !duration }"
      :isFlipped="!playerState.isPaused && !isActive"
      :duration="duration"
    />
    <div class="buttons">
      <ToolbarButton class="margin-right" @click="togglePlayPause()">
        <PlayPauseButton :state="playPauseState" />
      </ToolbarButton>
      <!-- <ToolbarButton class="margin-right" icon="ic_next_episode.svg" /> -->
      <VolumeButton />
      <div class="divider margin-right" />
      <ToolbarButton
        v-if="hasTimestamps"
        class="margin-right"
        icon="ic_prev_timestamp.svg"
        @click="gotoPreviousTimestamp()"
      />
      <ToolbarButton
        v-if="hasTimestamps"
        class="margin-right"
        icon="ic_next_timestamp.svg"
        @click="gotoNextTimestamp()"
      />
      <div class="divider margin-right" v-if="hasTimestamps" />
      <p class="current-time">
        {{ formattedTime }}&ensp;/&ensp;<span>{{ displayDuration }}</span>
      </p>
      <div class="space" />
      <ToolbarButton
        class="margin-left"
        icon="ic_timestamps.svg"
        title="Timestamps"
        @click="toggleTimestampsDialog"
      />
      <ToolbarButton
        v-if="isSaveTimestampsAvailable"
        class="margin-left"
        icon="ic_save_changes.svg"
        title="Save Changes"
        @click="saveChanges()"
      />
      <div class="divider margin-left" />
      <ToolbarButton
        class="margin-left margin-right"
        icon="ic_more.svg"
        @click="toggleAccountDialog"
      />
      <ToolbarButton v-if="isFullscreenEnabled" @click="toggleFullscreen()">
        <FullscreenButton :state="fullscreenState" :key="isFullscreenCount" />
      </ToolbarButton>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import Timeline from './Timeline.vue';
import ToolbarButton from './ToolbarButton.vue';
import AccountDialog from '../dialogs/AccountDialog.vue';
import PlayPauseButton from './animations/PlayPauseButton.vue';
import FullscreenButton from './animations/FullscreenButton.vue';
import VolumeButton from './animations/VolumeButton.vue';
import Utils from '@/common/utils/Utils';
import WebExtImg from '@/common/components/WebExtImg.vue';
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
    Timeline,
    PlayPauseButton,
    ToolbarButton,
    FullscreenButton,
    VolumeButton,
    AccountDialog,
    WebExtImg,
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
    const toggleAccountDialog = (): void => {
      showDialog(store.state.activeDialog === 'AccountDialog' ? undefined : 'AccountDialog');
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
      toggleAccountDialog,
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
.ToolBar {
  position: relative;
  // hide 1px of the timeline under the video's bounding box
  transform: translateY($toolbarHeight + 1px);
  transition: 200ms;
  transition-property: transform;
  user-select: none;
  cursor: default;

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
    background: linear-gradient(transparent, rgba($color: $background500, $alpha: 0.6));
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

  .timeline {
    // Line bottom of background with top of buttons
    margin-bottom: -2px;
  }

  .timeline-hidden {
    opacity: 0;
    pointer-events: none;
  }

  .buttons {
    height: $toolbarHeight;
    padding: 0 8px;
    display: flex;
    flex-direction: row;
    align-items: center;
    .margin-left {
      margin-left: 8px;
    }
    .margin-right {
      margin-right: 8px;
    }
    .divider {
      width: 2px;
      height: 32px;
      border-radius: 1px;
      background-color: $divider;
    }
    .space {
      flex: 1;
    }
  }
  .current-time {
    margin-left: 16px;
    color: $textPrimary;
    span {
      font-weight: 600;
      color: $textSecondary;
    }
  }
}
</style>
