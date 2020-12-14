<template>
  <div class="VolumeButton" :class="{ dragging: isDragging }">
    <ToolbarButton class="inner-button" @click="toggleMuted">
      <WebExtImg src="ic_volume_muted.svg" class="ic_muted" :class="volumeClass" />
      <WebExtImg src="ic_volume_speaker.svg" class="ic_speaker" :class="volumeClass" />
      <WebExtImg src="ic_volume_low.svg" class="ic_low" :class="volumeClass" />
      <WebExtImg src="ic_volume_high.svg" class="ic_high" :class="volumeClass" />
    </ToolbarButton>
    <Slider
      class="slider"
      :progress="volume"
      :max="1"
      backgroundColor="#ffffff48"
      foregroundColor="white"
      @seek="setVolume"
      @seek:start="isDragging = true"
      @seek:end="isDragging = false"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import WebExtImg from '@/common/components/WebExtImg.vue';
import ToolbarButton from '../ToolbarButton.vue';
import VideoControllerMixin from '@/common/mixins/VideoController';
import Slider from '../Slider.vue';

export default defineComponent({
  components: { WebExtImg, ToolbarButton, Slider },
  mixins: [VideoControllerMixin],
  mounted(): void {
    this.setupVolumeOverrideManager();
  },
  data() {
    return {
      isDragging: false,
    };
  },
  computed: {
    volumeClass(): string {
      if (this.isMuted) return 'muted';
      if (this.volume <= 0.05) return 'low';
      if (this.volume < 0.6) return 'medium';
      return 'high';
    },
  },
});
</script>

<style lang="scss" scoped>
.VolumeButton {
  display: flex;
  flex-direction: row;
  width: 128px;
  max-width: 40px;
  align-items: center;
  overflow-x: hidden;
  padding-right: 12px;
  margin-right: 8px;
  transition: 200ms;
  transition-property: max-width;
  &:hover,
  &.dragging {
    max-width: 128px;
  }

  .inner-button {
    width: 24px;
    height: 24px;
    margin-right: 12px;
    position: relative;
    img {
      position: absolute;
      left: 8px;
      right: 8px;
      top: 5px;
      bottom: 5px;
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
</style>
