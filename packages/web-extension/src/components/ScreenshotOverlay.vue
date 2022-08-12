<template>
  <div class="ScreenshotOverlay">
    <div
      v-if="image"
      class="as-absolute as-transition-all"
      :class="{
        'as-overlay-large': image.mode === 'full',
        'as-overlay-small': image.mode === 'small',
      }"
      @click.stop
    >
      <img class="as-object-contain as-object-center" :src="image.url" />
      <div class="as-buttons">
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
import { useWebExtensionStorageValue } from '~/composables/useWebExtensionStorage';
import { log } from '~/utils/log';

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
  @apply as-absolute as-inset-0 as-w-full as-h-full as-pointer-events-none;
  z-index: 2;
}

.as-overlay-large {
  @apply as-bottom-0 as-right-0 as-w-full as-h-full as-rounded-none as-opacity-0;
  max-width: 100vw;
}

.as-overlay-small {
  @apply as-opacity-100 as-right-4 as-rounded as-overflow-hidden as-pointer-events-auto as-shadow-md;
  bottom: 4.5rem;
  max-width: 10vw;
  min-width: 200px;
}

.as-buttons {
  @apply as-absolute as-inset-0 as-bg-on-primary as-bg-blend-multiply as-bg-opacity-medium as-opacity-0 as-transition-all as-flex as-items-center as-justify-center as-cursor-pointer as-space-x-4;
}

.as-overlay-small:hover .as-buttons {
  @apply as-opacity-100;
}
</style>
