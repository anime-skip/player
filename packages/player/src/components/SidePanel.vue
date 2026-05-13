<script lang="ts" setup>
import SidePanelAllPreferences from './SidePanelAllPreferences.vue';
import SidePanelEditTemplate from './SidePanelEditTemplate.vue';
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
    class="overflow-x-hidden bg-base-100"
    :class="{
      'shadow-xl': !!width,
    }"
    :style="{ width: `${width}px` }"
    @click.stop
  >
    <div ref="contentDiv" class="h-full w-fit">
      <side-panel-timestamps v-if="view === 'timestamps'" />
      <side-panel-all-preferences v-else-if="view === 'all-preferences'" />
      <side-panel-edit-timestamp v-else-if="view === 'edit-timestamp'" />
      <side-panel-edit-template v-else-if="view === 'edit-template'" />
    </div>
  </div>
</template>
