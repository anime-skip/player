<template>
  <div class="as-max-w-screen-md as-mx-auto as-space-y-8 as-py-16 as-px-16 md:as-px-0">
    <PopupHeader title="All Settings" />
    <div class="as-space-y-16">
      <GeneralSettings>
        <SelectDropDown
          label="Player Color Theme"
          :value="preferences.colorTheme"
          @update:value="onChangeColorTheme"
          :disabled="!auth.isLoggedIn"
        >
          <option v-for="theme in colorThemes" :key="theme.value" :value="theme.value">
            {{ theme.display }}
          </option>
        </SelectDropDown>
        <div />
        <RaisedCheckbox
          label="Hide timeline when minimized"
          :checked="preferences.hideTimelineWhenMinimized"
          @click="togglePref.mutate('hideTimelineWhenMinimized')"
          :disabled="!auth.isLoggedIn"
        />
        <RaisedCheckbox
          label="Allow minimized toolbar when editing"
          :checked="preferences.minimizeToolbarWhenEditing"
          @click="togglePref.mutate('minimizeToolbarWhenEditing')"
          :disabled="!auth.isLoggedIn"
        />
        <RaisedCheckbox
          label="Snap to the previous 0.5s when inserting a timestamp"
          :checked="preferences.createTimestampSnapBack"
          @click="togglePref.mutate('createTimestampSnapBack')"
          :disabled="!auth.isLoggedIn"
        />
      </GeneralSettings>
      <SkippedSections />
      <KeyboardShortcutTable />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ColorTheme } from 'common/src/api';
import { usePlayerConfig } from '../composables/usePlayerConfig';
import { useAuthStore } from '../state/stores/useAuthStore';
import { AllPreferences, usePreferencesStore } from '../state/stores/usePreferencesStore';
import { storeToRefs } from 'pinia';
import { useToggleBooleanPreferenceMutation } from '../state/composables/useToggleBooleanPreferenceMutation';
import { useSavePreferencesMutation } from '../state/composables/useSavePreferencesMutation';
import { PickTypes } from 'common/src/types';

const config = usePlayerConfig();
const auth = useAuthStore();
const prefsStore = usePreferencesStore();
const { preferences } = storeToRefs(prefsStore);

onMounted(() => {
  void config.usageClient.saveEvent('opened_all_settings');
});

const togglePref = useToggleBooleanPreferenceMutation();
const savePreferences = useSavePreferencesMutation();

function onChangeColorTheme(newValue: ColorTheme) {
  savePreferences.mutate({ colorTheme: newValue });
}
const colorThemes: Array<{ value: ColorTheme; display: string }> = [
  { value: ColorTheme.ANIME_SKIP_BLUE, display: 'Anime Skip (Blue)' },
  { value: ColorTheme.PER_SERVICE, display: 'Dynamic' },
  { value: ColorTheme.CRUNCHYROLL_ORANGE, display: 'Crunchyroll (Orange)' },
  { value: ColorTheme.FUNIMATION_PURPLE, display: 'Funimation (Purple)' },
  { value: ColorTheme.VRV_YELLOW, display: 'VRV (Yellow)' },
];
</script>
