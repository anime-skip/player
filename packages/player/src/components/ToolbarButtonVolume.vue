<script lang="ts" setup>
import IconVolumeHigh from '~icons/anime-skip/volume-high';
import IconVolumeLow from '~icons/anime-skip/volume-low';
import IconVolumeMedium from '~icons/anime-skip/volume-medium';
import IconVolumeMuted from '~icons/anime-skip/volume-muted';

import ToolbarButton from './ToolbarButton.vue';

const { volume, muted } = useVideoControls();

const controlVolume = computed({
  get() {
    return muted.value ? 0 : volume.value;
  },
  set(newVolume) {
    volume.value = newVolume;
    muted.value = false;
  },
});

const contentDiv = ref<HTMLDivElement>();
const width = useWidthAnimation(contentDiv);
</script>

<template>
  <toolbar-button class="group" title="Volume" @click="muted = !muted">
    <div class="overflow-x-hidden" :style="{ width: `${width}px` }">
      <div
        ref="contentDiv"
        class="flex w-fit items-center justify-center gap-2"
      >
        <div>
          <icon-volume-muted v-if="muted" />
          <icon-volume-low v-else-if="controlVolume < 0.01" />
          <icon-volume-medium v-else-if="controlVolume < 0.5" />
          <icon-volume-high v-else />
        </div>

        <div
          class="w-0 py-1 opacity-0 transition-opacity duration-500 group-hover:w-20 group-hover:opacity-100"
          @click.stop
        >
          <input
            class="volume range"
            type="range"
            v-model="controlVolume"
            max="1"
            min="0"
            step="any"
          />
        </div>
      </div>
    </div>
  </toolbar-button>
</template>
