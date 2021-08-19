<template>
  <tr>
    <td
      class="bg-control overflow-hidden"
      :class="{
        'rounded-tl-md': top,
        'rounded-bl-md': bottom,
      }"
    >
      <p class="px-4 body-1">{{ name }}</p>
    </td>
    <td class="bg-control">
      <div class="flex items-center justify-center">
        <KeyboardShortcutChooser :shortcut="shortcut.primary" @update="updatePrimary" />
      </div>
    </td>
    <td
      class="bg-control overflow-hidden"
      :class="{
        'rounded-tr-md': top,
        'rounded-br-md': bottom,
      }"
    >
      <div class="flex items-center justify-center">
        <KeyboardShortcutChooser
          secondary
          :shortcut="shortcut.secondary"
          @update="updateSecondary"
        />
      </div>
    </td>
  </tr>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { GetterTypes } from '~/common/store/getterTypes';

export default defineComponent({
  props: {
    name: { type: String, required: true },
    actionName: { type: String as PropType<KeyboardShortcutAction>, required: true },
    top: Boolean,
    bottom: Boolean,
  },
  emits: {
    updatePrimary: (_newShortcut: string | undefined) => true,
    updateSecondary: (_newShortcut: string | undefined) => true,
  },
  methods: {
    updatePrimary(value: string | undefined) {
      this.$emit('updatePrimary', value);
    },
    updateSecondary(value: string | undefined) {
      this.$emit('updateSecondary', value);
    },
  },
  computed: {
    shortcut(): { primary: string | undefined; secondary: string | undefined } {
      return {
        primary: this.$store.getters[GetterTypes.PRIMARY_KEYBOARD_SHORTCUTS][this.actionName],
        secondary: this.$store.getters[GetterTypes.SECONDARY_KEYBOARD_SHORTCUTS][this.actionName],
      };
    },
  },
});
</script>

<style scoped>
td {
  @apply h-12;
}
</style>
