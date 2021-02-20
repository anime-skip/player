<template>
  <div class="VolumeButton" :class="{ dragging: isDragging }">
    <ToolbarButton class="inner-button w-12" @click="toggleMuted">
      <WebExtImg src="ic_volume_muted.svg" class="ic_muted" :class="volumeClass" />
      <WebExtImg src="ic_volume_speaker.svg" class="ic_speaker" :class="volumeClass" />
      <WebExtImg src="ic_volume_low.svg" class="ic_low" :class="volumeClass" />
      <WebExtImg src="ic_volume_high.svg" class="ic_high" :class="volumeClass" />
    </ToolbarButton>
    <Slider
      class="slider white"
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
import KeyboardShortcutsMixin from '@/common/mixins/KeyboardShortcuts';

export default defineComponent({
  components: { WebExtImg, ToolbarButton },
  mixins: [VideoControllerMixin, KeyboardShortcutsMixin],
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
      if (this.volume <= 0.1) return 'low';
      if (this.volume < 0.6) return 'medium';
      return 'high';
    },
  },
  methods: {
    setupKeyboardShortcuts(): { [action in KeyboardShortcutAction]?: () => void } {
      return {
        volumeUp: () => this.addVolume(0.2),
        volumeDown: () => this.addVolume(-0.2),
      };
    },
  },
});
</script>

<style lang="scss" scoped>
@import '@anime-skip/ui/theme.scss';

.VolumeButton {
  display: flex;
  flex-direction: row;
  width: 136px;
  max-width: 56px;
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
