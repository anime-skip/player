<script lang="ts" setup>
import useIsDuplicateKeyboardShortcut from '../composables/useIsDuplicateKeyboardShortcut';
import useKeyboardBinding from '../composables/useKeyboardBinding';
import { KeyboardShortcutAction } from '../utils/keyboard-shortcut-utils';
import KeyboardShortcutChooser from './KeyboardShortcutChooser.vue';

const props = defineProps<{
  label: string;
  action: KeyboardShortcutAction;
  groupTop?: boolean;
  groupBottom?: boolean;
}>();

const {
  primaryKeyboardActionBindingMap,
  primaryKeyboardBindingActionsMap,
  secondaryKeyboardActionBindingMap,
  secondaryKeyboardBindingActionsMap,
} = useKeyboardShortcuts();

const primaryBinding = useKeyboardBinding(
  primaryKeyboardActionBindingMap,
  props.action,
);
const secondaryBinding = useKeyboardBinding(
  secondaryKeyboardActionBindingMap,
  props.action,
);

const isPrimaryDuplicate = useIsDuplicateKeyboardShortcut(
  primaryKeyboardBindingActionsMap,
  primaryBinding,
);
const isSecondaryDuplicate = useIsDuplicateKeyboardShortcut(
  secondaryKeyboardBindingActionsMap,
  secondaryBinding,
);
</script>

<template>
  <tr class="h-12">
    <td
      class="bg-neutral overflow-hidden"
      :class="{
        'rounded-tl': groupTop,
        'rounded-bl': groupBottom,
      }"
    >
      <p class="px-4 opacity-70 truncate">{{ label }}</p>
    </td>
    <td class="bg-neutral text-center">
      <keyboard-shortcut-chooser
        :duplicate="isPrimaryDuplicate"
        v-model="primaryBinding"
      />
    </td>
    <td
      class="bg-neutral px-2 text-center"
      :class="{
        'rounded-tr': groupTop,
        'rounded-br': groupBottom,
      }"
    >
      <keyboard-shortcut-chooser
        secondary
        :duplicate="isSecondaryDuplicate"
        v-model="secondaryBinding"
      />
    </td>
  </tr>
</template>
