<template>
  <tr>
    <td
      class="bg-control overflow-hidden"
      :class="{
        'rounded-tl-md': groupTop,
        'rounded-bl-md': groupBottom,
      }"
    >
      <p class="px-4 body-1">{{ name }}</p>
    </td>
    <td class="bg-control">
      <div class="flex items-center justify-center">
        <KeyboardShortcutChooser :shortcut="primaryKeyBinding" @update="updatePrimaryKeyBinding" />
      </div>
    </td>
    <td
      class="bg-control overflow-hidden"
      :class="{
        'rounded-tr-md': groupTop,
        'rounded-br-md': groupBottom,
      }"
    >
      <div class="flex items-center justify-center">
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
import {
  KeyboardShortcutAction,
  usePrimaryKeyboardShortcutPrefs,
  useSecondaryKeyboardShortcutPrefs,
} from '~/common/state/useKeyboardShortcutPrefs';

const props = defineProps<{
  name: string;
  actionName: KeyboardShortcutAction;
  groupTop?: boolean;
  groupBottom?: boolean;
}>();
const emit = defineEmits({
  updatePrimary: (_newKeyBinding: string | null) => true,
  updateSecondary: (_newKeyBinding: string | null) => true,
});

function updatePrimaryKeyBinding(newKeyBinding: string | undefined): void {
  emit('updatePrimary', newKeyBinding ?? null);
}
function updateSecondaryKeyBinding(newKeyBinding: string | undefined): void {
  emit('updateSecondary', newKeyBinding ?? null);
}

const { primaryShortcutsActionToKeyMap } = usePrimaryKeyboardShortcutPrefs();
const primaryKeyBinding = computed(() => primaryShortcutsActionToKeyMap[props.actionName]);
const { secondaryShortcutsActionToKeyMap } = useSecondaryKeyboardShortcutPrefs();
const secondaryKeyBinding = computed(() => secondaryShortcutsActionToKeyMap[props.actionName]);
</script>

<style scoped>
td {
  @apply h-12;
}
</style>
