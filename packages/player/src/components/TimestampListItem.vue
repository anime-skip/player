<script lang="ts" setup>
import IconClose from '~icons/anime-skip/close';
import IconEdit from '~icons/anime-skip/edit';

import useTimestampEditedState from '../composables/useTimestampEditedState';
import { formatTimestampInS } from '../utils/time-utils';
import { AmbiguousTimestamp } from '../utils/timestamp-utils';
import { TimestampState } from '../utils/TimestampState';
import InPlaceTimestampTypeSelect from './InPlaceTimestampTypeSelect.vue';

const props = defineProps<{
  timestamp: AmbiguousTimestamp;
}>();

const timestamp = toRef(props, 'timestamp');
const type = useTimestampType(timestamp);
const at = computed(() => formatTimestampInS(props.timestamp.at, false));

const { currentTime } = useVideoControls();
function goToTimestamp() {
  currentTime.value = props.timestamp.at;
}

const deleteTimestamp = useDeleteTimestamp();
const editTimestamp = useEditExistingTimestamp();

const hoveredId = useHoveredTimestampId();
const setHovered = useThrottleFn(() => {
  hoveredId.value = props.timestamp.id;
});
function clearHovered() {
  hoveredId.value = undefined;
}

const state = useTimestampEditedState(timestamp);
</script>

<template>
  <tr
    @mouseenter="setHovered"
    @mousemove="setHovered"
    @mouseleave="clearHovered"
  >
    <td class="h-12">
      <div class="cursor-pointer pl-2 pr-4" @click="goToTimestamp">
        <p
          class="text-right text-lg font-black"
          :class="{
            'text-primary': state === TimestampState.NotChanged,
            'text-secondary': state === TimestampState.Edited,
            'text-success': state === TimestampState.New,
          }"
        >
          {{ at }}
        </p>
        <p
          v-if="state === TimestampState.Edited"
          class="-mt-1.5 text-right text-[0.66rem] font-bold uppercase text-secondary"
        >
          Edited
        </p>
        <p
          v-else-if="state === TimestampState.New"
          class="-mt-1.5 text-right text-[0.66rem] font-bold uppercase text-success"
        >
          New
        </p>
      </div>
    </td>

    <td class="h-12 w-full" :title="type?.description">
      <div class="flex items-center gap-1">
        <!-- Select -->
        <in-place-timestamp-type-select :timestamp="timestamp" />

        <div class="flex-1" />

        <!-- Edit -->
        <button
          class="btn btn-circle btn-ghost shrink-0 text-base-content text-opacity-50 hover:text-opacity-100"
          title="Edit"
          type="button"
          @click="editTimestamp(timestamp)"
        >
          <icon-edit class="h-[1.375rem] w-[1.375rem]" />
        </button>

        <!-- Delete -->
        <button
          class="btn btn-circle btn-ghost shrink-0 text-base-content text-opacity-50 hover:text-error hover:text-opacity-100"
          title="Delete"
          type="button"
          @click="deleteTimestamp(timestamp)"
        >
          <icon-close class="h-5 w-5" />
        </button>
      </div>
    </td>
  </tr>
</template>
