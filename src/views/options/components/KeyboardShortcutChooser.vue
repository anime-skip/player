<template>
  <div
    class="select-none px-2.5 py-1 surface rounded cursor-pointer"
    :class="{
      'surface-4': !!shortcut && secondary,
      'surface-primary': !!shortcut && !secondary,
      'surface-error': isDuplicate,
    }"
    @click="showKeyBindingEditor"
  >
    <pre
      v-if="shortcut"
      class="font-mono-2 font-size-body"
      :class="{
        'text-on-primary': !secondary,
        'text-on-surface': secondary,
      }"
      :tabindex="0"
      >{{ shortcut }}</pre
    >
    <pre
      v-else
      class="opacity-medium font-mono-2 font-size-body"
      :tabindex="0"
      @click="showKeyBindingEditor"
    >
unset</pre
    >

    <teleport to="body">
      <div
        v-if="isShowingKeyBindingEditor"
        class="
          fixed
          inset-0
          bg-control-variant bg-opacity-high
          select-none
          flex flex-col
          justify-center
          items-center
        "
      >
        <h5
          class="
            w-full
            max-w-xs
            p-4
            rounded-md
            ring-2 ring-on-surface ring-opacity-low
            text-center
            font-bold
          "
        >
          <span v-if="!currentKeyBinding" class="no-selection">[Press a key]</span>
          <pre v-else class="font-mono-2">{{ currentKeyBinding }}</pre>
        </h5>
        <table class="w-full max-w-xs mt-8">
          <tr>
            <td class="text-right"><code>Enter</code></td>
            <td class="text-left">to save</td>
          </tr>
          <tr>
            <td class="text-right"><code>Backspace</code></td>
            <td class="text-left">to remove</td>
          </tr>
          <tr>
            <td class="text-right"><code>Esc</code></td>
            <td class="text-left">to cancel</td>
          </tr>
        </table>
      </div>
    </teleport>
  </div>
</template>

<script lang="ts" setup>
import {
  usePrimaryKeyboardShortcutPrefs,
  useSecondaryKeyboardShortcutPrefs,
} from '~/common/state/useKeyboardShortcutPrefs';
import Utils from '~/common/utils/Utils';

// TODO-REQ: Test full behavior

defineProps<{
  shortcut?: string;
  secondary?: boolean;
}>();
const emit = defineEmits({
  update: (_pressedKey: string | undefined) => true,
});

// Editor

const isShowingKeyBindingEditor = ref(false);
const currentKeyBinding = ref('');

function showKeyBindingEditor() {
  isShowingKeyBindingEditor.value = true;
  currentKeyBinding.value = '';
}
function hideKeyBindingEditor() {
  isShowingKeyBindingEditor.value = true;
}
function onKeyDown(event: KeyboardEvent) {
  event.preventDefault();
  event.stopImmediatePropagation();
  event.stopPropagation();

  if (!Utils.isModiferKeyPressed(event)) {
    switch (event.key) {
      case 'Escape':
        return hideKeyBindingEditor();
      case 'Enter':
        console.debug('emitting', currentKeyBinding.value);
        if (currentKeyBinding.value) emit('update', currentKeyBinding.value);
        return hideKeyBindingEditor();
      case 'Backspace':
        emit('update', undefined);
        return hideKeyBindingEditor();
    }
  }
  if (!Utils.isKeyComboAllowed(event)) {
    return;
  }

  currentKeyBinding.value = Utils.keyComboFromEvent(event);
}
watch(isShowingKeyBindingEditor, isShowing => {
  if (isShowing) {
    document.addEventListener('keydown', onKeyDown);
  } else {
    document.removeEventListener('keydown', onKeyDown);
  }
});

const { primaryShortcutsKeyToActionsMap } = usePrimaryKeyboardShortcutPrefs();
const { secondaryShortcutsKeyToActionsMap } = useSecondaryKeyboardShortcutPrefs();
const isDuplicate = computed(() => {
  const actions = [
    ...(primaryShortcutsKeyToActionsMap.value[currentKeyBinding.value] ?? []),
    ...(secondaryShortcutsKeyToActionsMap.value[currentKeyBinding.value] ?? []),
  ];
  return actions.length > 1;
});
</script>

<style scoped>
td {
  @apply px-1 pb-2;
  width: 50%;
}

code {
  @apply rounded bg-control-highlight px-2.5 pb-1 pt-2;
}

.font-mono-2 {
  font-family: monospace;
}
.font-size-body {
  font-size: 16px;
}
</style>
