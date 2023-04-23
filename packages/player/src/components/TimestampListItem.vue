<script lang="ts" setup>
import { TimestampFragment } from '../utils/api';
import { formatTimestampInS } from '../utils/time-utils';
import IconEdit from '~icons/anime-skip/edit';
import IconClose from '~icons/anime-skip/close';
import InPlaceTimestampTypeSelect from './InPlaceTimestampTypeSelect.vue';

const props = defineProps<{
  timestamp: TimestampFragment;
}>();

const at = computed(() => formatTimestampInS(props.timestamp.at, false));

const { currentTime } = useVideoControls();
function goToTimestamp() {
  currentTime.value = props.timestamp.at;
}

const timestamp = toRef(props, 'timestamp');
const type = useTimestampType(timestamp);
</script>

<template>
  <tr>
    <td class="h-12">
      <div class="pl-2 pr-4 cursor-pointer" @click="goToTimestamp">
        <p class="text-lg font-black text-primary text-right">{{ at }}</p>
        <p v-if="false" class="uppercase text-xs text-primary -mt-1 text-right">
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
        >
          <icon-edit class="w-[1.375rem] h-[1.375rem]" />
        </button>

        <!-- Delete -->
        <button
          class="shrink-0 btn btn-circle btn-ghost text-base-content text-opacity-50 hover:text-error hover:text-opacity-100"
          title="Delete"
        >
          <icon-close class="w-5 h-5" />
        </button>
      </div>
    </td>
  </tr>
</template>
