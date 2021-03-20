<template>
  <div
    class="select-none px-2.5 py-1 surface rounded cursor-pointer"
    :class="{
      'surface-4': !!shortcut,
      'surface-primary': !secondary,
      'surface-error': duplicate,
    }"
    @click="showEditor"
  >
    <pre
      v-if="shortcut"
      class="font-mono-2 font-size-body"
      :class="{
        'text-on-primary': !secondary,
        'text-on-surface': secondary,
      }"
      tabindex="0"
      >{{ shortcut }}</pre
    >
    <pre v-else class="opacity-medium font-mono-2 font-size-body" tabindex="0" @click="showEditor">
unset</pre
    >

    <teleport to="body">
      <div
        v-if="isShowingEditor"
        class="fixed inset-0 bg-control-variant bg-opacity-high select-none flex flex-col justify-center items-center"
      >
        <h5
          class="w-full max-w-xs p-4 rounded-md ring-2 ring-on-surface ring-opacity-low text-center font-bold"
        >
          <span v-if="!editKey" class="no-selection">[Press a key]</span>
          <pre v-else class="font-mono-2">{{ editKey }}</pre>
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

<script lang="ts">
import { GetterTypes } from '@/common/store/getterTypes';
import Utils from '@/common/utils/Utils';
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    shortcut: { type: String, default: undefined },
    secondary: Boolean,
  },
  emits: ['update'],
  data() {
    return {
      isShowingEditor: false,
      editKey: '',
    };
  },
  methods: {
    showEditor() {
      this.isShowingEditor = true;
      this.editKey = '';
    },
    hideEditor() {
      this.isShowingEditor = false;
    },
    onKeyDown(event: KeyboardEvent) {
      if (!Utils.isModiferKeyPressed(event)) {
        switch (event.key) {
          case 'Escape':
            return this.hideEditor();
          case 'Enter':
            console.debug('emitting', this.editKey);
            if (this.editKey) this.$emit('update', this.editKey);
            return this.hideEditor();
          case 'Backspace':
            this.$emit('update', undefined);
            return this.hideEditor();
        }
      }
      if (!Utils.isKeyComboAllowed(event)) {
        return;
      }

      this.editKey = Utils.keyComboFromEvent(event);

      event.preventDefault();
      event.stopImmediatePropagation();
      event.stopPropagation();
    },
  },
  watch: {
    isShowingEditor() {
      if (this.isShowingEditor) {
        document.addEventListener('keydown', this.onKeyDown);
      } else {
        document.removeEventListener('keydown', this.onKeyDown);
      }
    },
  },
  computed: {
    duplicate(): boolean {
      if (this.shortcut == null) return false;
      const count: number | undefined = this.$store.getters[GetterTypes.KEY_COMBO_COUNT_MAP][
        this.shortcut
      ];
      return count != null && count > 1;
    },
  },
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
