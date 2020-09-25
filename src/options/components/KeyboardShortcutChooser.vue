<template>
  <div class="KeyboardShortcutChooser noselect">
    <pre v-if="shortcut" tabindex="0" @click="showEditor">{{ shortcut }}</pre>
    <pre v-else class="unset" tabindex="0" @click="showEditor">unset</pre>

    <div v-if="isShowingEditor" class="fullscreen-overlay noselect">
      <h1 class="preview">
        <pre v-if="!editKey" class="no-selection">[Press a key]</pre>
        <pre v-else>{{ editKey }}</pre>
      </h1>
      <p class="hint">Press <code>Enter</code> to save</p>
      <p class="hint">Press <code>Esc</code> to cancel</p>
      <p class="hint">Press <code>Backspace</code> to remove the shortcut</p>
    </div>
  </div>
</template>

<script lang="ts">
import Utils from '@/common/utils/Utils';
import Vue from 'vue';

export default Vue.extend({
  props: {
    shortcut: { type: String, required: false },
  },
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
      switch (event.key) {
        case 'Escape':
          return this.hideEditor();
        case 'Enter':
          console.log('emitting', this.editKey);
          if (this.editKey) this.$emit('update', this.editKey);
          return this.hideEditor();
        case 'Backspace':
          this.$emit('update', undefined);
          return this.hideEditor();
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
});
</script>

<style scoped lang="scss">
.KeyboardShortcutChooser {
  display: flex;
  flex-direction: column;
  align-items: center;
  & > pre {
    font-family: monospace;
    font-size: 16px;
    background-color: $divider;
    padding: 4px 8px;
    border-radius: 3px;
    font-weight: bold;
    color: rgba(255, 255, 255, 0.8);
    cursor: pointer;
    transition: 100ms;

    &:hover {
      background-color: rgba($color: white, $alpha: 0.18);
    }
    &:hover:active {
      background-color: rgba($color: white, $alpha: 0.24);
    }
  }

  .unset {
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
    background-color: rgba($color: $background300, $alpha: 0.84);
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
