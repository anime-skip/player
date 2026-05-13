<script lang="ts" setup>
import IconFullscreenEnter from '~icons/anime-skip/fullscreen-enter';
import IconFullscreenExit from '~icons/anime-skip/fullscreen-exit';

import ToolbarButton from './ToolbarButton.vue';

const { isFullscreen, isSupported, toggle } = usePlayerFullscreen();
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
