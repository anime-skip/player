<script setup lang="ts">
import useScreenshotPreview from '../composables/useScreenshotPreview';
import IMdiDownload from '~icons/mdi/download';

const preview = useScreenshotPreview();
function clearImage() {
  preview.value = undefined;
}

const filename = computed(
  () => `Anime Skip Screenshot ${new Date().toISOString()}.jpeg`,
);
</script>

<template>
  <div v-if="preview" class="absolute inset-0 pointer-events-none">
    <div
      class="h-24 aspect-video bottom-20 left-4 absolute pointer-events-auto bg-black rounded-box"
      @click.stop
    >
      <img
        class="h-full w-full object-contain object-center"
        :src="preview"
        alt="Screenshot"
      />
      <div
        class="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity flex"
      >
        <!-- TODO: Make the filename "{episode name} at {timestamp}" -->
        <a
          class="btn btn-ghost btn-circle m-auto"
          :href="preview"
          target="_blank"
          title="Download"
          :download="filename"
          @click="clearImage()"
        >
          <i-mdi-download class="w-6 h-6" />
        </a>
      </div>
    </div>
  </div>
</template>
