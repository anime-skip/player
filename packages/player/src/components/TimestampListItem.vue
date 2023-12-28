<script lang="ts" setup>
import { formatTimestampInS } from '../utils/time-utils';
import IconEdit from '~icons/anime-skip/edit';
import IconClose from '~icons/anime-skip/close';
import InPlaceTimestampTypeSelect from './InPlaceTimestampTypeSelect.vue';
import { AmbiguousTimestamp } from '../utils/timestamp-utils';
import useTimestampEditedState from '../composables/useTimestampEditedState';
import { TimestampState } from '../utils/TimestampState';

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
      <div class="pl-2 pr-4 cursor-pointer" @click="goToTimestamp">
        <p
          class="text-lg font-black text-right"
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
          class="uppercase text-[0.66rem] text-secondary font-bold -mt-1.5 text-right"
        >
          Edited
        </p>
        <p
          v-else-if="state === TimestampState.New"
          class="uppercase text-[0.66rem] text-success font-bold -mt-1.5 text-right"
        >
          New
        </p>
      </div>
    </td>

    <td class="w-full h-12" :title="type?.description">
      <div class="flex items-center gap-1">
        <!-- Select -->
        <in-place-timestamp-type-select :timestamp="timestamp" />

        <div class="flex-1" />

        <!-- Edit -->
        <button
          class="shrink-0 btn btn-circle btn-ghost text-base-content text-opacity-50 hover:text-opacity-100"
          title="Edit"
          type="button"
          @click="editTimestamp(timestamp)"
        >
          <icon-edit class="w-[1.375rem] h-[1.375rem]" />
        </button>

        <!-- Delete -->
        <button
          class="shrink-0 btn btn-circle btn-ghost text-base-content text-opacity-50 hover:text-error hover:text-opacity-100"
          title="Delete"
          type="button"
          @click="deleteTimestamp(timestamp)"
        >
          <icon-close class="w-5 h-5" />
        </button>
      </div>
    </td>
  </tr>
</template>
