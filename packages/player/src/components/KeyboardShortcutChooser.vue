<script lang="ts" setup>
import {
  isKeyComboAllowed,
  isModifierKeyPressed,
  keyComboFromEvent,
} from '../utils/keyboard-shortcut-utils';

const props = defineProps<{
  modelValue?: string;
  secondary?: boolean;
  duplicate: boolean;
}>();

const emits = defineEmits<{
  (event: 'update:modelValue', newBinding: string | undefined): void;
}>();

const { shadowHtml } = useShadowRoot();

const binding = useVModel(props, 'modelValue', emits);

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

  if (!isModifierKeyPressed(event)) {
    switch (event.key) {
      case 'Escape':
        return hideKeyBindingEditor();
      case 'Enter':
        if (currentKeyBinding.value) binding.value = currentKeyBinding.value;
        return hideKeyBindingEditor();
      case 'Backspace':
        binding.value = undefined;
        return hideKeyBindingEditor();
    }
  }
  if (!isKeyComboAllowed(event)) {
    return;
  }
  currentKeyBinding.value = keyComboFromEvent(event);
}

watch(isShowingKeyBindingEditor, (isShowing) => {
  if (isShowing) {
    document.addEventListener('keydown', onKeyDown);
  } else {
    document.removeEventListener('keydown', onKeyDown);
  }
});
</script>

<template>
  <div
    class="btn px-2.5 normal-case"
    :class="{
      'btn-secondary': !!binding && secondary,
      'btn-primary': !!binding && !secondary,
      'btn-error': duplicate,
    }"
    @click="showKeyBindingEditor"
  >
    <pre v-if="binding" class="font-mono text-sm" :tabindex="0">{{
      binding
    }}</pre>
    <pre
      v-else
      class="font-mono text-sm opacity-50"
      :tabindex="0"
      @click="showKeyBindingEditor"
    >
unset</pre
    >

    <teleport :to="shadowHtml">
      <div
        v-if="isShowingKeyBindingEditor"
        class="pointer-events-auto fixed inset-0 z-[99999] flex select-none flex-col items-center justify-center bg-neutral bg-opacity-90"
        @click.stop
      >
        <h5
          class="w-full max-w-xs rounded p-4 text-center font-bold ring-2 ring-base-content ring-opacity-50"
        >
          <span v-if="!currentKeyBinding" class="no-selection"
            >[Press a key]</span
          >
          <pre v-else class="font-mono">{{ currentKeyBinding }}</pre>
        </h5>
        <table class="mt-8 w-full max-w-xs border-spacing-4">
          <tr>
            <td class="text-right"><kbd class="kbd">Enter</kbd></td>
            <td class="pl-2 text-left">to save</td>
          </tr>
          <tr>
            <td class="text-right"><kbd class="kbd">Backspace</kbd></td>
            <td class="pl-2 text-left">to remove</td>
          </tr>
          <tr>
            <td class="text-right"><kbd class="kbd">Esc</kbd></td>
            <td class="pl-2 text-left">to cancel</td>
          </tr>
        </table>
      </div>
    </teleport>
  </div>
</template>
