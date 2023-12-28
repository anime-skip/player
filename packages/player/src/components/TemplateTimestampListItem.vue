<script lang="ts" setup>
import { TimestampFragment } from '../utils/api';
import { formatTimestampInS } from '../utils/time-utils';

const props = defineProps<{
  timestamp: TimestampFragment;
  checked: boolean;
}>();
const emit = defineEmits<{
  (event: 'toggled', timestamp: TimestampFragment, isChecked: boolean): void;
}>();

const at = computed(() => formatTimestampInS(props.timestamp.at, false));

const hoveredId = useHoveredTimestampId();
const type = useTimestampType(computed(() => props.timestamp));

const modelValue = computed({
  get() {
    return props.checked;
  },
  set(checked) {
    emit('toggled', props.timestamp, checked);
  },
});
</script>

<template>
  <li>
    <label
      class="flex items-center p-2 gap-4 cursor-pointer"
      @mouseover="hoveredId = timestamp.id"
      @mouseout="hoveredId = undefined"
    >
      <input
        type="checkbox"
        class="checkbox checkbox-sm checked:checkbox-primary"
        v-model="modelValue"
      />
      <span class="font-black text-primary">
        {{ at }}
      </span>
      <span :title="type?.description">
        {{ type?.name }}
      </span>
    </label>
  </li>
</template>
