<template>
  <div class="KeyboardShortcutItem">
    <p class="column1">{{ name }}</p>
    <KeyboardShortcutChooser
      class="column2"
      :shortcut="shortcuts.primary"
      @update="updatePrimary"
    />
    <KeyboardShortcutChooser
      class="column3"
      :shortcut="shortcuts.secondary"
      @update="updateSecondary"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue';
import KeyboardShortcutChooser from '@/options/components/KeyboardShortcutChooser.vue';

export default Vue.extend({
  components: { KeyboardShortcutChooser },
  props: {
    name: { type: String, required: true },
    shortcuts: { type: Object, required: true } as PropOptions<{
      primary: string | undefined;
      secondary: string | undefined;
    }>,
  },
  methods: {
    updatePrimary(value: string | undefined) {
      console.log('1');
      this.$emit('updatePrimary', value);
    },
    updateSecondary(value: string | undefined) {
      console.log('2');
      this.$emit('updateSecondary', value);
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
