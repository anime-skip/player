<script lang="ts" setup>
import SidePanelTimestamps from './SidePanelTimestamps.vue';

const contentDiv = ref<HTMLDivElement>();
const width = useWidthAnimation(contentDiv);

const view = useView();
</script>

<template>
  <div
    class="bg-neutral overflow-x-hidden ease-in"
    :class="{
      'shadow-xl': width !== '0px',
    }"
    :style="{ width }"
    @click.stop
  >
    <div ref="contentDiv" class="w-fit h-full">
      <side-panel-timestamps v-if="view === 'timestamps'" />
    </div>
  </div>
</template>
