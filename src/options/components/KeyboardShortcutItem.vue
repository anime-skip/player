<template>
  <div class="KeyboardShortcutItem">
    <p class="column1">{{ name }}</p>
    <KeyboardShortcutChooser class="column2" :shortcut="shortcut.primary" @update="updatePrimary" />
    <KeyboardShortcutChooser
      class="column3"
      secondary
      :shortcut="shortcut.secondary"
      @update="updateSecondary"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import KeyboardShortcutChooser from '@/options/components/KeyboardShortcutChooser.vue';
import { GetterTypes } from '@/common/store/getterTypes';

export default defineComponent({
  components: { KeyboardShortcutChooser },
  props: {
    name: { type: String, required: true },
    actionName: { type: String as PropType<KeyboardShortcutAction>, required: true },
  },
  emits: ['updatePrimary', 'updateSecondary'],
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

<style scoped lang="scss">
.KeyboardShortcutItem {
  height: 48px;
  background-color: $input500;
  color: white;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-bottom: 1px solid $divider;

  &:first-child {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }
  &:last-child {
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    border-bottom: none;
  }

  .column1 {
    flex-grow: 3;
    flex-basis: 0;
    padding-left: 16px;
  }
  .column2 {
    flex-grow: 1;
    flex-basis: 0;
    text-align: center;
  }
  .column3 {
    flex-grow: 1;
    flex-basis: 0;
    text-align: center;
  }
}
</style>
