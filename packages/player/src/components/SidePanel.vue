<script lang="ts" setup>
import SidePanelAllPreferences from './SidePanelAllPreferences.vue';
import SidePanelTimestamps from './SidePanelTimestamps.vue';

const contentDiv = ref<HTMLDivElement>();
const width = useWidthAnimation(contentDiv);

const { view } = useView();

// Autoscale video based on side panel width
const { shadowHtml } = useShadowRoot();
const video = useVideoElement();
watch(width, (width) => {
  const scale = 1 - width / shadowHtml.clientWidth;
  video.value.style.transform = `scale(${scale * 100}%)`;
  video.value.style.transformOrigin = 'left';
});
</script>

<template>
  <div
    class="bg-neutral overflow-x-hidden ease-in"
    :class="{
      'shadow-xl': !!width,
    }"
    :style="{ width: `${width}px` }"
    @click.stop
  >
    <div ref="contentDiv" class="w-fit h-full">
      <side-panel-timestamps v-if="view === 'timestamps'" />
      <side-panel-all-preferences v-if="view === 'all-preferences'" />
    </div>
  </div>
</template>
