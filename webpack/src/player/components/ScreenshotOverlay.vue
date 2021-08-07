<template>
  <div class="ScreenshotOverlay absolute inset-0 w-full h-full pointer-events-none">
    <div
      v-if="image"
      class="overlay"
      :class="{
        [`overlay-large`]: image.mode === 'full',
        [`overlay-small`]: image.mode === 'small',
      }"
      @click.stop
    >
      <img
        class="image"
        :class="{
          [`image-large`]: image.mode === 'full',
          [`image-small`]: image.mode === 'small',
        }"
        :src="image.url"
      />
      <div class="buttons">
        <a
          :href="image.url"
          target="_blank"
          title="Download"
          :download="image.filename"
          @click="image = undefined"
        >
          <web-ext-img src="ic_save.svg" />
        </a>
        <!-- <a class="mr-16x5" :href="image.url" target="_blank" title="View Full Size" @click="image = undefined">
          <web-ext-img src="ic_open_in_new.svg" />
        </a> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import WebExtImg from '@/common/components/WebExtImg.vue';
import CaptureScreenshot from '@/common/utils/CaptureScreenshot';
import { useKeyboardShortcuts } from '@/common/mixins/KeyboardShortcuts';
import { defineComponent, ref } from 'vue';
import { useStore } from 'vuex';
import Browser from '@/common/utils/Browser';

interface ImageDetails {
  url: string;
  mode: 'full' | 'small';
  filename: string;
}

const smallAfter = 100; // ms
const dismissAfter = 10000; // ms

export default defineComponent({
  components: { WebExtImg },
  setup() {
    const image = ref<ImageDetails | undefined>();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const activeTimeouts: any[] = [];
    const addImage = (imageData: string) => {
      // Set it
      image.value = {
        url: imageData,
        mode: 'full',
        filename: 'anime-skip-screenshot-' + Date.now(),
      };

      // Make it small
      activeTimeouts.push(
        setTimeout(() => {
          if (image.value == null) return;
          image.value = {
            ...image.value,
            mode: 'small',
          };
        }, smallAfter)
      );

      // Remove it
      activeTimeouts.push(
        setTimeout(() => {
          image.value = undefined;
        }, dismissAfter)
      );
    };

    if (Browser.detect() === 'firefox') {
      useKeyboardShortcuts('Screenshot Overlay', useStore(), {
        takeScreenshot() {
          while (activeTimeouts.length > 0) {
            clearTimeout(activeTimeouts.pop());
          }
          image.value = undefined;
          const video = global.getVideo?.();
          if (video == null) throw Error('Video is not loaded yet');
          CaptureScreenshot(video).then(addImage).catch(console.error);
        },
      });
    }

    return {
      image,
    };
  },
});
</script>

<style scoped>
.ScreenshotOverlay {
  z-index: 2;
}

.overlay {
  @apply absolute transition-all duration-200 overflow-hidden;
  transform-origin: 100% 100%;
}
.image {
  @apply w-full h-full object-contain object-center;
}
.buttons {
  @apply absolute inset-0 bg-background bg-opacity-medium opacity-0 transition-all flex items-center justify-center cursor-pointer;
}
.buttons img {
  scale: 500%;
  transform-origin: 50% 50%;
}

.overlay-large {
  @apply bottom-0 right-0 w-full h-full rounded-none opacity-medium;
  scale: 100%;
}

.overlay-small {
  @apply opacity-100 right-4 rounded pointer-events-auto;
  bottom: 4.5rem;
  scale: 20%;
}
.overlay-small:hover .buttons {
  @apply opacity-100;
}

.mr-16x5 {
  margin-right: 20rem;
}
</style>
