<template>
  <div
    class="as-select-none as-px-2.5 as-py-1 as-surface as-rounded as-cursor-pointer"
    :class="{
      'as-surface-4': !!shortcut && secondary,
      'as-surface-primary': !!shortcut && !secondary,
      'as-surface-error': isDuplicate,
    }"
    @click="showKeyBindingEditor"
  >
    <pre
      v-if="shortcut"
      class="as-font-mono-2 as-font-size-body"
      :class="{
        'as-text-on-primary': !isDuplicate && !secondary,
        'as-text-on-surface': !isDuplicate && secondary,
        'as-text-on-error': isDuplicate,
      }"
      :tabindex="0"
      >{{ shortcut }}</pre
    >
    <pre
      v-else
      class="as-opacity-medium as-font-mono-2 as-font-size-body"
      :tabindex="0"
      @click="showKeyBindingEditor"
    >
unset</pre
    >

    <teleport to="body">
      <div
        v-if="isShowingKeyBindingEditor"
        class="as-fixed as-inset-0 as-bg-control-variant as-bg-opacity-high as-select-none as-flex as-flex-col as-justify-center as-items-center"
      >
        <h5
          class="as-w-full as-max-w-xs as-p-4 as-rounded-md as-ring-2 as-ring-on-surface as-ring-opacity-low as-text-center as-font-bold"
        >
          <span v-if="!currentKeyBinding" class="as-no-selection">[Press a key]</span>
          <pre v-else class="as-font-mono-2">{{ currentKeyBinding }}</pre>
        </h5>
        <table class="as-w-full as-max-w-xs as-mt-8">
          <tr>
            <td class="as-text-right"><code>Enter</code></td>
            <td class="as-text-left">to save</td>
          </tr>
          <tr>
            <td class="as-text-right"><code>Backspace</code></td>
            <td class="as-text-left">to remove</td>
          </tr>
          <tr>
            <td class="as-text-right"><code>Esc</code></td>
            <td class="as-text-left">to cancel</td>
          </tr>
        </table>
      </div>
    </teleport>
  </div>
</template>

<script lang="ts" setup>
import { debug } from '~/common/utils/log';
import { useDuplicateBindingChecker } from '~/content-scripts/player/hooks/useDubplicateBindingChecker';
import Utils from '~utils/GeneralUtils';

const props = defineProps<{
  shortcut?: string;
  secondary?: boolean;
}>();
const emit = defineEmits({
  update: (_pressedKey: string | undefined) => true,
});

const selectedShortcut = computed(() => props.shortcut);
const duplicateChecker = useDuplicateBindingChecker();
const isDuplicate = duplicateChecker(selectedShortcut);

// Editor

const isShowingKeyBindingEditor = ref(false);
const currentKeyBinding = ref('');

function showKeyBindingEditor() {
  isShowingKeyBindingEditor.value = true;
  currentKeyBinding.value = '';
}
function hideKeyBindingEditor() {
  isShowingKeyBindingEditor.value = false;
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
        debug('emitting', currentKeyBinding.value);
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
</script>

<style scoped>
td {
  @apply as-px-1 as-pb-2;
  width: 50%;
}

code {
  @apply as-rounded as-bg-control-highlight as-px-2.5 as-pb-1 as-pt-2;
}

.as-font-mono-2 {
  font-family: monospace;
}
.as-font-size-body {
  font-size: 16px;
}
</style>
