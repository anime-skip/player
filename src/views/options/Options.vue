<template>
  <div class="max-w-screen-md mx-auto space-y-8 py-16 px-16 md:px-0">
    <PopupHeader title="All Settings" />
    <div class="space-y-16">
      <GeneralSettings>
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
      </GeneralSettings>
      <SkippedSections />
      <KeyboardShortcutTable />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useIsLoggedIn } from '~/common/state/useAuth';
import { useGeneralPreferences, useToggleBooleanPref } from '~/common/state/useGeneralPreferences';

// TODO-REQ: verify no INTIAL_LOAD call works

const isLoggedIn = useIsLoggedIn();
const preferences = useGeneralPreferences();
const toggleBooleanPreference = useToggleBooleanPref();

const hideTimelineWhenMinimized = computed(() => preferences.value.hideTimelineWhenMinimized);
const minimizeToolbarWhenEditing = computed(() => preferences.value.minimizeToolbarWhenEditing);
</script>
