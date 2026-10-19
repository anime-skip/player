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
const { width: containerWidth, height: containerHeight } =
  useElementSize(shadowHtml);
watchEffect(() => {
  // Assume a 16:9 video. Shift the video
  // left to stay centered in the remaining space, and only scale it down if
  // the rendered video wouldn't fit next to the panel.
  const panelWidth = width.value;
  const videoWidth = Math.min(
    containerWidth.value,
    (containerHeight.value * 16) / 9,
  );
  const scale = videoWidth
    ? Math.min(1, (containerWidth.value - panelWidth) / videoWidth)
    : 1;
  video.value.style.transform = `translateX(${-panelWidth / 2}px) scale(${scale})`;
  video.value.style.transformOrigin = 'center';
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
