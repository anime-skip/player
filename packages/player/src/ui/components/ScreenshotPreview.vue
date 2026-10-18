<script setup lang="ts">
import IMdiDownload from '~icons/mdi/download';

import useScreenshotPreview from '../composables/useScreenshotPreview';

const preview = useScreenshotPreview();
function clearImage() {
  preview.value = undefined;
}

const filename = computed(
  () => `Anime Skip Screenshot ${new Date().toISOString()}.jpeg`,
);
</script>

<template>
  <div v-if="preview" class="pointer-events-none absolute inset-0">
    <div
      class="rounded-box pointer-events-auto absolute bottom-20 left-4 aspect-video h-24 bg-black"
      @click.stop
    >
      <img
        class="h-full w-full object-contain object-center"
        :src="preview"
        alt="Screenshot"
      />
      <div
        class="absolute inset-0 flex bg-black bg-opacity-50 opacity-0 transition-opacity hover:opacity-100"
      >
        <!-- TODO: Make the filename "{episode name} at {timestamp}" -->
        <a
          class="btn btn-circle btn-ghost m-auto"
          :href="preview"
          target="_blank"
          title="Download"
          :download="filename"
          @click="clearImage()"
        >
          <i-mdi-download class="h-6 w-6" />
        </a>
      </div>
    </div>
  </div>
</template>
