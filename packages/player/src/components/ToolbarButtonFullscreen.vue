<script lang="ts" setup>
import ToolbarButton from './ToolbarButton.vue';
import IconFullscreenEnter from '~icons/anime-skip/fullscreen-enter';
import IconFullscreenExit from '~icons/anime-skip/fullscreen-exit';
import { SECOND } from '../utils/time';

const options = usePlayerOptions();
const fullscreenElement = ref(options.fullscreenElement());
useIntervalFn(() => {
  fullscreenElement.value = options.fullscreenElement();
}, 1 * SECOND);

const { isFullscreen, isSupported, toggle } = useFullscreen(fullscreenElement);
</script>

<template>
  <toolbar-button
    v-if="isSupported"
    :title="isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'"
    @click="toggle"
  >
    <icon-fullscreen-exit v-if="isFullscreen" />
    <icon-fullscreen-enter v-else />
  </toolbar-button>
</template>
