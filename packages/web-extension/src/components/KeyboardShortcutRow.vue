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
import {
  KeyboardShortcutAction,
  usePrimaryKeyboardShortcutPrefs,
  useSecondaryKeyboardShortcutPrefs,
} from '~/stores/useKeyboardShortcutPrefs';

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
  @apply as-h-12;
}
</style>
