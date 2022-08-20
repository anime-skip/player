<template>
  <div class="as-max-w-screen-md as-mx-auto as-space-y-8 as-py-16 as-px-16 md:as-px-0">
    <PopupHeader title="All Settings" />
    <div class="as-space-y-16">
      <GeneralSettings>
        <SelectDropDown
          label="Player Color Theme"
          :value="colorTheme"
          @update:value="onChangeColorTheme"
          :disabled="!isLoggedIn"
        >
          <option v-for="theme in colorThemes" :key="theme.value" :value="theme.value">
            {{ theme.display }}
          </option>
        </SelectDropDown>
        <div />
        <RaisedCheckbox
          label="Hide timeline when minimized"
          :checked="hideTimelineWhenMinimized"
          @click="toggleBooleanPreference('hideTimelineWhenMinimized')"
          :disabled="!isLoggedIn"
        />
        <RaisedCheckbox
          label="Allow minimized toolbar when editing"
          :checked="minimizeToolbarWhenEditing"
          @click="toggleBooleanPreference('minimizeToolbarWhenEditing')"
          :disabled="!isLoggedIn"
        />
        <RaisedCheckbox
          label="Snap to the previous 0.5s when inserting a timestamp"
          :checked="createTimestampSnapBack"
          @click="toggleBooleanPreference('createTimestampSnapBack', true)"
          :disabled="!isLoggedIn"
        />
      </GeneralSettings>
      <SkippedSections />
      <KeyboardShortcutTable />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useIsLoggedIn } from '../stores/useAuth';
import {
  useGeneralPreferences,
  useToggleBooleanPref,
  useUpdateRemotePref,
} from '../stores/useGeneralPreferences';
import UsageStats from '~/utils/UsageStats';
import { ColorTheme } from 'common/src/api';

onMounted(() => {
  void UsageStats.saveEvent('opened_all_settings');
});

const isLoggedIn = useIsLoggedIn();
const preferences = useGeneralPreferences();
const toggleBooleanPreference = useToggleBooleanPref();

const hideTimelineWhenMinimized = computed(() => preferences.value.hideTimelineWhenMinimized);
const minimizeToolbarWhenEditing = computed(() => preferences.value.minimizeToolbarWhenEditing);
const createTimestampSnapBack = computed(() => preferences.value.createTimestampSnapBack);

const updateColorTheme = useUpdateRemotePref<ColorTheme>();
function onChangeColorTheme(newValue: ColorTheme) {
  updateColorTheme('colorTheme', newValue);
}
const colorTheme = computed(() => preferences.value.colorTheme);
const colorThemes: Array<{ value: ColorTheme; display: string }> = [
  { value: ColorTheme.ANIME_SKIP_BLUE, display: 'Anime Skip (Blue)' },
  { value: ColorTheme.PER_SERVICE, display: 'Dynamic' },
  { value: ColorTheme.CRUNCHYROLL_ORANGE, display: 'Crunchyroll (Orange)' },
  { value: ColorTheme.FUNIMATION_PURPLE, display: 'Funimation (Purple)' },
  { value: ColorTheme.VRV_YELLOW, display: 'VRV (Yellow)' },
];
</script>
