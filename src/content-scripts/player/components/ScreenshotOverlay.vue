<template>
  <div class="ScreenshotOverlay">
    <div
      v-if="image"
      class="absolute transition-all"
      :class="{
        [`overlay-large`]: image.mode === 'full',
        [`overlay-small`]: image.mode === 'small',
      }"
      @click.stop
    >
      <img class="object-contain object-center" :src="image.url" />
      <div class="buttons">
        <a
          :href="image.url"
          target="_blank"
          title="Download"
          :download="image.filename"
          @click="clearImage()"
        >
          <web-ext-img src="ic_save.svg" />
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useTimeout } from '@anime-skip/ui';
import { ref } from 'vue';
import { useWebExtensionStorageValue } from '~/common/hooks/useWebExtensionStorage';
import { log } from '~/common/utils/log';

interface ImageDetails {
  url: string;
  mode: 'full' | 'small';
  filename: string;
}
const smallAfter = 100;
const dismissAfter = 10000;

const image = ref<ImageDetails | undefined>();
// eslint-disable-next-line @typescript-eslint/no-explicit-any

function clearImage() {
  image.value = undefined;
  setBase64Screenshot(undefined);
  clearPreviewTimeout();
  clearMakeSmallTimeout();
}

const [setPreviewTimeout, clearPreviewTimeout] = useTimeout();
const [setMakeSmallTimeout, clearMakeSmallTimeout] = useTimeout();
function addImage(imageData: string) {
  clearPreviewTimeout();
  clearMakeSmallTimeout();

  // Set it
  image.value = {
    url: imageData,
    mode: 'full',
    filename: 'anime-skip-screenshot-' + Date.now(),
  };

  // Make it small
  setMakeSmallTimeout(() => {
    if (image.value == null) return;
    image.value = {
      ...image.value,
      mode: 'small',
    };
  }, smallAfter);

  // Remove it
  setPreviewTimeout(() => {
    image.value = undefined;
    setBase64Screenshot(undefined);
  }, dismissAfter);
}

// capturing

const { value: base64Screenshot, setValue: setBase64Screenshot } = useWebExtensionStorageValue<
  string | undefined
>('screenshot', undefined, 'local');

watch(base64Screenshot, data => {
  if (data != null) {
    log('Screenshot received', data);
    addImage(data);
  }
});
</script>

<style scoped>
.ScreenshotOverlay {
  @apply absolute inset-0 w-full h-full pointer-events-none;
  z-index: 2;
}

.overlay-large {
  @apply bottom-0 right-0 w-full h-full rounded-none opacity-0;
  max-width: 100vw;
}

.overlay-small {
  @apply opacity-100 right-4 rounded overflow-hidden pointer-events-auto shadow-md;
  bottom: 4.5rem;
  max-width: 10vw;
  min-width: 200px;
}

.buttons {
  @apply absolute inset-0 bg-on-primary bg-blend-multiply bg-opacity-medium opacity-0 transition-all flex items-center justify-center cursor-pointer space-x-4;
}

.overlay-small:hover .buttons {
  @apply opacity-100;
}
</style>
