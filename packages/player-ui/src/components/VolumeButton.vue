<template>
  <div class="VolumeButton" :class="{ 'as-dragging': isDragging }">
    <ToolbarButton class="as-inner-button as-w-12" @click="controller.toggleMute()">
      <i-my-volume-muted class="as-w-6 as-h-6 as-ic-muted" :class="volumeClass" />
      <i-my-volume-speaker class="as-w-6 as-h-6 as-ic-speaker" :class="volumeClass" />
      <i-my-volume-low class="as-w-6 as-h-6 as-ic-low" :class="volumeClass" />
      <i-my-volume-high class="as-w-6 as-h-6 as-ic-high" :class="volumeClass" />
    </ToolbarButton>
    <Slider
      class="as-slider"
      :progress="videoState.volumeIntPercent"
      :max="100"
      @seek="controller.setVolume"
      @seek:start="isDragging = true"
      @seek:end="isDragging = false"
    />
  </div>
</template>

<script lang="ts" setup>
import { useKeyboardShortcuts } from '../composables/useKeyboardShortcuts';
import { useVideoController } from '../state/composables/useVideoController';
import { useVideoStateStore } from '../state/stores/useVideoStateStore';

const isDragging = ref(false);

const videoState = useVideoStateStore();
const volumeClass = computed(() => {
  if (videoState.isMuted) return 'as-muted';
  if (videoState.volumeIntPercent <= 10) return 'as-low';
  if (videoState.volumeIntPercent < 60) return 'as-medium';
  return 'as-high';
});

const VOLUME_STEP = 10; // percent
const controller = useVideoController();
useKeyboardShortcuts('VolumeButton', {
  volumeUp() {
    controller.setVolume(videoState.volumeIntPercent + VOLUME_STEP);
  },
  volumeDown() {
    controller.setVolume(videoState.volumeIntPercent - VOLUME_STEP);
  },
});
</script>

<style lang="scss" scoped>
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
  &.as-dragging {
    max-width: 136px;
  }

  .as-inner-button {
    margin-right: 8px;
    position: relative;
    svg {
      position: absolute;
      left: 12px;
      right: 12px;
      top: 8px;
      bottom: 8px;
      transition: 200ms;
    }

    .as-ic-muted {
      opacity: 0;
      &.as-muted {
        opacity: 1;
      }
    }
    .as-ic-speaker {
      &.as-muted {
        opacity: 0;
        transform: translateX(-4px);
      }
      &.as-low {
        transform: translateX(0);
      }
      &.as-medium {
        transform: translateX(-2px);
      }
      &.as-high {
        transform: translateX(-4px);
      }
    }
    .as-ic-low {
      &.as-muted {
        opacity: 0;
        transform: translateX(-2px);
      }
      &.as-low {
        opacity: 0;
      }
      &.as-medium {
        // Empty
      }
      &.as-high {
        transform: translateX(-2px);
      }
    }
    .as-ic-high {
      &.as-muted {
        opacity: 0;
      }
      &.as-low {
        opacity: 0;
      }
      &.as-medium {
        opacity: 0;
      }
      &.as-high {
        // Empty
      }
    }
  }

  .as-slider {
    flex: 1;
    cursor: pointer;
    display: none;
  }
  &:hover .as-slider,
  &.as-dragging .as-slider {
    display: block;
  }
}

.as-slider {
  --as-slider-background-color: rgba(255, 255, 255, #{theme('opacity.low')});
  --as-slider-foreground-color: white;
}
</style>
