<script lang="ts" setup>
import {
  AmbiguousTimestamp,
  UNKNOWN_TIMESTAMP_TYPE_ID,
} from '../utils/timestamp-utils';
import SidePanelLayout from './SidePanelLayout.vue';
import EditTimestampForm from './EditTimestampForm.vue';

const { goBack } = useView();

function done() {
  goBack();
}

// Auto-delete the timestamp if it is local and type unknown
const activeTimestamp = useActiveTimestamp() as Ref<AmbiguousTimestamp>;
const willAutoDelete = computed(
  () =>
    activeTimestamp.value.typeId === UNKNOWN_TIMESTAMP_TYPE_ID &&
    typeof activeTimestamp.value.id === 'number',
);
const deleteTimestamp = useDeleteTimestamp();
onUnmounted(() => {
  if (willAutoDelete.value) deleteTimestamp(activeTimestamp.value);
});
</script>

<template>
  <side-panel-layout class="w-80" mode="back" @submit="done">
    <template #title>Edit Timestamp</template>

    <template #content>
      <edit-timestamp-form v-model:timestamp="activeTimestamp" />
    </template>

    <template #buttons>
      <button type="submit" class="grow-1 btn btn-primary" @click="done">
        Save Timestamp
      </button>
      <button
        class="flex-1 btn btn-outline hover:btn-error"
        @click.prevent="deleteTimestamp(activeTimestamp!)"
      >
        Delete
      </button>
    </template>
  </side-panel-layout>
</template>
