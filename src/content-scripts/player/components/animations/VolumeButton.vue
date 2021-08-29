<template>
  <div class="VolumeButton" :class="{ dragging: isDragging }">
    <ToolbarButton class="inner-button w-12" @click="toggleMute">
      <WebExtImg src="ic_volume_muted.svg" class="ic_muted" :class="volumeClass" />
      <WebExtImg src="ic_volume_speaker.svg" class="ic_speaker" :class="volumeClass" />
      <WebExtImg src="ic_volume_low.svg" class="ic_low" :class="volumeClass" />
      <WebExtImg src="ic_volume_high.svg" class="ic_high" :class="volumeClass" />
    </ToolbarButton>
    <Slider
      class="slider white"
      :progress="videoState.volumePercent"
      :max="100"
      background-color="#ffffff48"
      foreground-color="white"
      @seek="setVolume"
      @seek:start="isDragging = true"
      @seek:end="isDragging = false"
    />
  </div>
</template>

<script lang="ts" setup>
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { useVideoController, useVideoState } from '../../state/useVideoState';

onMounted(() => {
  // TODO - was this working in the first place?
  // function onIgnoredVolumeChange(): void {
  //   const video = getVideoOrThrow();
  //   if (!video?.muted && video?.volume === this.volume) return;
  //   console.debug(`Ignoring volume change event, reset to ${this.volume}`);
  //   video.volume = this.volume;
  // }
  // global.onVideoChanged(video => {
  //   video.addEventListener('volumechange', onIgnoredVolumeChange);
  // });
});

const isDragging = ref(false);

const videoState = useVideoState();
const volumeClass = computed(() => {
  if (videoState.isMuted) return 'muted';
  if (videoState.volumePercent <= 10) return 'low';
  if (videoState.volumePercent < 60) return 'medium';
  return 'high';
});

const VOLUME_STEP = 10; // percent
const { setVolumePercent, toggleMute } = useVideoController();
useKeyboardShortcuts('VolumeButton', {
  volumeUp() {
    setVolumePercent(videoState.volumePercent + VOLUME_STEP);
  },
  volumeDown() {
    setVolumePercent(videoState.volumePercent - VOLUME_STEP);
  },
});
function setVolume(volumeDecimal: number) {
  setVolumePercent(volumeDecimal * 100);
}
</script>

<style lang="scss" scoped>
@import '@anime-skip/ui/variables-theme.scss';

.VolumeButton {
  display: flex;
  flex-direction: row;
  width: 136px;
  max-width: 57px;
  align-items: center;
  overflow-x: hidden;
  padding-right: 16px;
  margin-right: 8px;
  transition: 200ms;
  transition-property: max-width;
  &:hover,
  &.dragging {
    max-width: 136px;
  }

  .inner-button {
    margin-right: 8px;
    position: relative;
    img {
      position: absolute;
      left: 12px;
      right: 12px;
      top: 8px;
      bottom: 8px;
      transition: 200ms;
    }

    .ic_muted {
      opacity: 0;
      &.muted {
        opacity: 1;
      }
    }
    .ic_speaker {
      &.muted {
        opacity: 0;
        transform: translateX(-4px);
      }
      &.low {
        transform: translateX(0);
      }
      &.medium {
        transform: translateX(-2px);
      }
      &.high {
        transform: translateX(-4px);
      }
    }
    .ic_low {
      &.muted {
        opacity: 0;
        transform: translateX(-2px);
      }
      &.low {
        opacity: 0;
      }
      &.medium {
        // Empty
      }
      &.high {
        transform: translateX(-2px);
      }
    }
    .ic_high {
      &.muted {
        opacity: 0;
      }
      &.low {
        opacity: 0;
      }
      &.medium {
        opacity: 0;
      }
      &.high {
        // Empty
      }
    }
  }

  .slider {
    flex: 1;
    cursor: pointer;
    display: none;
  }
  &:hover .slider,
  &.dragging .slider {
    display: block;
  }
}

.slider.white {
  --default-background-color: #{rgba($color: $backgroundColor-on-surface, $alpha: $opacity-low)} !important;
  --default-foreground-color: #{$backgroundColor-on-surface} !important;
}
</style>
