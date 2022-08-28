<template>
  <tr>
    <td
      class="as-bg-control as-overflow-hidden"
      :class="{
        'as-rounded-tl-md': groupTop,
        'as-rounded-bl-md': groupBottom,
      }"
    >
      <p class="as-px-4 as-body-1">{{ name }}</p>
    </td>
    <td class="as-bg-control">
      <div class="as-flex as-items-center as-justify-center">
        <KeyboardShortcutChooser :shortcut="primaryKeyBinding" @update="updatePrimaryKeyBinding" />
      </div>
    </td>
    <td
      class="as-bg-control as-overflow-hidden"
      :class="{
        'as-rounded-tr-md': groupTop,
        'as-rounded-br-md': groupBottom,
      }"
    >
      <div class="as-flex as-items-center as-justify-center">
        <KeyboardShortcutChooser
          secondary
          :shortcut="secondaryKeyBinding"
          @update="updateSecondaryKeyBinding"
        />
      </div>
    </td>
  </tr>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import {
  KeyboardShortcutAction,
  useKeyboardShortcutStore,
} from '../state/stores/useKeyboardShortcutStore';

const props = defineProps<{
  name: string;
  actionName: KeyboardShortcutAction;
  groupTop?: boolean;
  groupBottom?: boolean;
}>();
const emit = defineEmits<{
  (event: 'updatePrimary', newKeyBinding: string | null): void;
  (event: 'updateSecondary', newKeyBinding: string | null): void;
}>();

function updatePrimaryKeyBinding(newKeyBinding: string | undefined): void {
  emit('updatePrimary', newKeyBinding ?? null);
}
function updateSecondaryKeyBinding(newKeyBinding: string | undefined): void {
  emit('updateSecondary', newKeyBinding ?? null);
}

const { primaryActionToKey, secondaryActionToKey } = storeToRefs(useKeyboardShortcutStore());

const primaryKeyBinding = computed(() => primaryActionToKey.value[props.actionName]);
const secondaryKeyBinding = computed(() => secondaryActionToKey.value[props.actionName]);
</script>

<style scoped>
td {
  @apply as-h-12;
}
</style>
