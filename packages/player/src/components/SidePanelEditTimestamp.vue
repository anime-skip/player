<script lang="ts" setup>
import {
  AmbiguousTimestamp,
  UNKNOWN_TIMESTAMP_TYPE_ID,
} from '../utils/timestamp-utils';
import SidePanelLayout from './SidePanelLayout.vue';
import EditTimestampForm from './EditTimestampForm.vue';
import useWasPlayingBeforeAddingTimestamp from '../composables/useWasPlayingBeforeAddingTimestamp';

const { goBack } = useView();

const wasPlaying = useWasPlayingBeforeAddingTimestamp();
const { playing } = useVideoControls();
function done() {
  setTimeout(goBack);

  // Resume playing the video if it was paused before creating the timestamp
  if (wasPlaying.value) playing.value = true;
}

// Auto-delete the timestamp if it is local and type unknown
const activeTimestamp = useActiveTimestamp() as Ref<AmbiguousTimestamp>;
const willAutoDelete = computed(
  () =>
    activeTimestamp.value.typeId === UNKNOWN_TIMESTAMP_TYPE_ID &&
    typeof activeTimestamp.value.id === 'number',
);

const queueDelete = ref(false);
const deleteTimestampImmediately = useDeleteTimestamp();
function deleteTimestamp() {
  queueDelete.value = true;
  goBack();
}
onUnmounted(() => {
  if (willAutoDelete.value || queueDelete.value)
    deleteTimestampImmediately(activeTimestamp.value);
});
</script>

<template>
  <side-panel-layout class="w-80" mode="back" @form-submit="done">
    <template #title>Edit Timestamp</template>

    <template #content>
      <edit-timestamp-form v-model:timestamp="activeTimestamp" />
    </template>

    <template #buttons>
      <button type="submit" class="grow-1 btn btn-primary">
        Save Timestamp
      </button>
      <button
        class="flex-1 btn hover:btn-error"
        type="button"
        @click="deleteTimestamp"
      >
        Delete
      </button>
    </template>
  </side-panel-layout>
</template>
