<template>
  <div class="max-w-screen-md mx-auto space-y-8 py-16 px-16 md:px-0">
    <PopupHeader title="All Settings" />
    <div class="space-y-16">
      <GeneralSettings />
      <SkippedSections />
      <KeyboardShortcutTable />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PopupHeader from '@/popup/components/PopupHeader.vue';
import KeyboardShortcutTable from './components/KeyboardShortcutTable.vue';
import GeneralSettings from '../common/components/GeneralSettings.vue';
import { MutationTypes } from '@/common/store/mutationTypes';
import SkippedSections from '@/common/components/SkippedSections.vue';
import { ActionTypes } from '@/common/store/actionTypes';

export default defineComponent({
  components: { KeyboardShortcutTable, PopupHeader, GeneralSettings, SkippedSections },
  mounted(): void {
    this.$store.dispatch(ActionTypes.INITIAL_LOAD, undefined);
  },
  methods: {
    updatePrimaryShortcut(type: KeyboardShortcutAction): (value: string) => void {
      return (value: string | undefined): void => {
        this.$store.commit(MutationTypes.SET_PRIMARY_KEYBOARD_SHORTCUT, { type, value });
      };
    },
    updateSecondaryShortcut(type: KeyboardShortcutAction): (value: string) => void {
      return (value: string | undefined): void => {
        this.$store.commit(MutationTypes.SET_SECONDARY_KEYBOARD_SHORTCUT, { type, value });
      };
    },
  },
});
</script>
