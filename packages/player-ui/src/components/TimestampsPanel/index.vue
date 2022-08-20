<template>
  <BasicDialog
    id="TimestampsPanel"
    name="TimestampsPanel"
    gravity-x="flex-end"
    gravity-y="center"
    @show="onShow"
  >
    <EditTimestamp v-if="isShowingEditTimestamp" :initial-tab="initialTab" />
    <EditTemplate v-else-if="isShowingTemplate" />
    <TimestampList v-else />
  </BasicDialog>
</template>

<script lang="ts" setup>
import { useEditingState } from '../../stores/useEditingState';
import { useIsEditingTemplate } from './useTimestampPanelState';

const editingState = useEditingState();
const activeTimestamp = computed(() => editingState.activeTimestamp);
const isShowingEditTimestamp = computed(() => activeTimestamp.value != null);
const isShowingTemplate = useIsEditingTemplate();

const initialTab = ref<'details' | 'edit'>('details');
function onShow(): void {
  initialTab.value = activeTimestamp.value == null ? 'details' : 'edit';
}
</script>

<style lang="scss">
#TimestampsPanel {
  pointer-events: none;

  .as-dialog-root-container {
    width: 300px;
    min-height: 500px;
    height: 70%;
    max-height: 800px;
    margin-bottom: 36px;
    pointer-events: auto;
    display: flex;
    flex-direction: column;
    border-top-right-radius: 0px;
    border-bottom-right-radius: 0px;

    @media screen and (max-height: 600px) {
      min-height: unset;
      height: 100%;
      max-height: unset;
      margin-bottom: 60px;
      border-top-left-radius: 0px;
    }
  }
}
</style>
