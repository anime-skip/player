<script lang="ts" setup>
import ToolbarButton from './ToolbarButton.vue';
import IconVolumeHigh from '~icons/anime-skip/volume-high';
import IconVolumeMedium from '~icons/anime-skip/volume-medium';
import IconVolumeLow from '~icons/anime-skip/volume-low';
import IconVolumeMuted from '~icons/anime-skip/volume-muted';

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
    <div class="overflow-x-hidden" :style="{ width }">
      <div
        ref="contentDiv"
        class="w-fit flex items-center justify-center gap-2"
      >
        <div>
          <icon-volume-muted v-if="muted" />
          <icon-volume-low v-else-if="controlVolume < 0.01" />
          <icon-volume-medium v-else-if="controlVolume < 0.5" />
          <icon-volume-high v-else />
        </div>

        <div
          class="py-1 w-0 opacity-0 group-hover:w-20 group-hover:opacity-100 transition-opacity duration-500"
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
