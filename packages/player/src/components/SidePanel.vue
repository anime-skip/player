<script lang="ts" setup>
import SidePanelAllPreferences from './SidePanelAllPreferences.vue';
import SidePanelEditTimestamp from './SidePanelEditTimestamp.vue';
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
    class="bg-base-100 overflow-x-hidden"
    :class="{
      'shadow-xl': !!width,
    }"
    :style="{ width: `${width}px` }"
    @click.stop
  >
    <div ref="contentDiv" class="w-fit h-full">
      <side-panel-timestamps v-if="view === 'timestamps'" />
      <side-panel-all-preferences v-else-if="view === 'all-preferences'" />
      <side-panel-edit-timestamp v-else-if="view === 'edit-timestamp'" />
    </div>
  </div>
</template>
