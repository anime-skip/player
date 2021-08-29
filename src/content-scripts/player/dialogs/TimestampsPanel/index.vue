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
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { useEditingState } from '../../state/useEditingState';
import { provideTimestampsPanelState } from './useTimestampPanelState';

provideTimestampsPanelState();

const editingState = useEditingState();
const activeTimestamp = computed(() => editingState.activeTimestamp);
const isShowingEditTimestamp = computed(() => activeTimestamp.value != null);
const isShowingTemplate = computed(() => true); // TODO this.$store.state.showEditTemplate in useTimestampPanelState()

const initialTab = ref<'details' | 'edit'>('details');
function onShow(): void {
  initialTab.value = activeTimestamp.value == null ? 'details' : 'edit';
}

// Update timestamp on manual advances

function updateTimestamp(): void {
  // TODO - should this keyboard listener be in `EditTimestamp`?
  // timeSelectRef.value?.focus();
  // if (this.activeTimestamp != null) {
  //   const newTimestamp = this.$store.getters[GetterTypes.APPLY_TIMESTAMP_DIFF]({ // useApplyTimestampDiff
  //     ...this.activeTimestamp,
  //     at: this.getCurrentTime(),
  //   });
  //   this.$store.commit(MutationTypes.SET_ACTIVE_TIMESTAMP, newTimestamp);
  // }
}
useKeyboardShortcuts('Timestamps Panel', {
  // Advance
  advanceFrame: updateTimestamp,
  advanceSmall: updateTimestamp,
  advanceMedium: updateTimestamp,
  advanceLarge: updateTimestamp,
  // Rewind
  rewindFrame: updateTimestamp,
  rewindSmall: updateTimestamp,
  rewindMedium: updateTimestamp,
  rewindLarge: updateTimestamp,
});
</script>

<style lang="scss">
#TimestampsPanel {
  pointer-events: none;

  .dialog-root-container {
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

    @media screen and(max-height: 600px) {
      min-height: unset;
      height: 100%;
      max-height: unset;
      margin-bottom: 60px;
      border-top-left-radius: 0px;
    }

    & > * {
      padding: 14px 16px;
    }
  }
}
</style>
