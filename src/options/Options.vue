<template>
  <ExtensionRoot class="max-w-screen-md mx-auto space-y-8 py-16 px-16 md:px-0">
    <PopupHeader title="All Settings" />
    <div class="space-y-16">
      <GeneralSettings>
        <RaisedCheckbox
          label="Hide timeline when minimized"
          :checked="hideTimelineWhenMinimized"
          @click="togglePreference('hideTimelineWhenMinimized')"
          :disabled="!isLoggedIn"
        />
        <RaisedCheckbox
          label="Allow minimized toolbar when editing"
          :checked="minimizeToolbarWhenEditing"
          @click="togglePreference('minimizeToolbarWhenEditing')"
          :disabled="!isLoggedIn"
        />
      </GeneralSettings>
      <SkippedSections />
      <KeyboardShortcutTable />
    </div>
  </ExtensionRoot>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import PopupHeader from '@/popup/components/PopupHeader.vue';
import KeyboardShortcutTable from './components/KeyboardShortcutTable.vue';
import GeneralSettings from '../common/components/GeneralSettings.vue';
import { MutationTypes } from '@/common/store/mutationTypes';
import SkippedSections from '@/common/components/SkippedSections.vue';
import ExtensionRoot from '@/common/components/ExtensionRoot.vue';
import { ActionTypes } from '@/common/store/actionTypes';
import usePreferenceEditor from '@/common/composition/preferenceEditor';
import { useStore } from 'vuex';

export default defineComponent({
  components: {
    KeyboardShortcutTable,
    PopupHeader,
    GeneralSettings,
    SkippedSections,
    ExtensionRoot,
  },
  setup() {
    const store = useStore();
    const isLoggedIn = computed(() => store.state.isLoggedIn);
    const { togglePreference, getBooleanPreference } = usePreferenceEditor();

    const hideTimelineWhenMinimized = computed(() =>
      getBooleanPreference('hideTimelineWhenMinimized')
    );
    const minimizeToolbarWhenEditing = computed(() =>
      getBooleanPreference('minimizeToolbarWhenEditing')
    );

    return {
      isLoggedIn,
      togglePreference,
      hideTimelineWhenMinimized,
      minimizeToolbarWhenEditing,
    };
  },
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
