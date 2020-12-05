<template>
  <div class="VolumeButton" :class="{ dragging: isDragging }">
    <ToolbarButton class="inner-button" @click.native="toggleMuted">
      <WebExtImg src="ic_volume_muted.svg" class="ic_muted" :class="volumeClass" />
      <WebExtImg src="ic_volume_speaker.svg" class="ic_speaker" :class="volumeClass" />
      <WebExtImg src="ic_volume_low.svg" class="ic_low" :class="volumeClass" />
      <WebExtImg src="ic_volume_high.svg" class="ic_high" :class="volumeClass" />
    </ToolbarButton>
    <VueSlider
      class="slider"
      v-model="level"
      height="3"
      silent
      :max="1"
      :interval="0.05"
      :duration="0.1"
      :dotSize="11"
      @change="setVolume"
      @drag-start="isDragging = true"
      @drag-end="isDragging = false"
    />
  </div>
</template>

<script lang="ts">
import vueMixins from 'vue-typed-mixins';
import WebExtImg from '@/common/components/WebExtImg.vue';
import VueSlider from 'vue-slider-component';
import ToolbarButton from '../ToolbarButton.vue';
import '../../scss/VolumeSlider.scss';
import VideoControllerMixin from '../../../common/mixins/VideoController';

export default vueMixins(VideoControllerMixin).extend({
  components: { WebExtImg, VueSlider, ToolbarButton },
  data() {
    return {
      isDragging: false,
    };
  },
  computed: {
    volumeClass(): string {
      if (this.isMuted) return 'muted';
      if (this.level <= 0.05) return 'low';
      if (this.level < 0.6) return 'medium';
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
