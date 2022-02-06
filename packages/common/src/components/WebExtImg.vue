<template>
  <img :src="webExtSrc" :draggable="draggable" ondragstart="return false;" />
</template>

<script lang="ts" setup>
import browser from 'webextension-polyfill';

const props = defineProps<{
  src: string;
  draggable?: boolean;
}>();

const webExtSrc = computed(() => browser.runtime.getURL('assets/' + props.src));
</script>
