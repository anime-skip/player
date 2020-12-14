<template>
  <div class="KeyboardShortcutChooser noselect" :class="{ secondary }">
    <pre v-if="shortcut" tabindex="0" @click="showEditor" :class="{ duplicate }">{{
      shortcut
    }}</pre>
    <pre v-else class="unset" tabindex="0" @click="showEditor">unset</pre>

    <div v-if="isShowingEditor" class="fullscreen-overlay noselect">
      <h1 class="preview">
        <pre v-if="!editKey" class="no-selection">[Press a key]</pre>
        <pre v-else>{{ editKey }}</pre>
      </h1>
      <p class="hint"><code>Enter</code> to save</p>
      <p class="hint"><code>Esc</code> to cancel</p>
      <p class="hint"><code>Backspace</code> to remove</p>
    </div>
  </div>
</template>

<script lang="ts">
import { GetterTypes } from '@/common/store/getterTypes';
import Utils from '@/common/utils/Utils';
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    shortcut: { type: String, required: false },
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

<style scoped lang="scss">
.KeyboardShortcutChooser {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 4px;

  & > pre {
    font-family: monospace;
    font-size: 16px;
    background-color: $primary300;
    padding: 4px 8px;
    border-radius: 3px;
    font-weight: bold;
    color: black;
    cursor: pointer;
    transition: 100ms;

    &:hover {
      filter: brightness(1.1);
    }
    &:hover:active {
      filter: brightness(1.2);
    }
  }

  &.secondary > pre {
    color: rgba($color: white, $alpha: 0.75);
    background-color: $divider;
  }

  & > pre.duplicate {
    color: $textPrimary;
    background-color: $red700;
  }

  & > pre.unset {
    color: $textSecondary;
    background-color: transparent;
    font-weight: normal;
    font-style: italic;
  }

  .fullscreen-overlay {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba($color: $background300, $alpha: 0.9);
    z-index: 1;

    .preview {
      width: 100%;
      max-width: 300px;
      padding: 16px;
      padding-bottom: 12px;
      border: 2px solid $divider;
      border-radius: 8px;
      text-align: center;
    }

    .no-selection {
      opacity: 0.64;
    }

    .hint {
      color: $textSecondary;
      margin-top: 16px;
    }

    code {
      background-color: $divider;
      padding: 2px 4px;
      border-radius: 2px;
      font-family: monospace;
      font-size: 15px;
    }
  }
}
</style>
