<template>
  <div>
    <h6 class="as-mb-4">Keyboard Shortcuts</h6>
    <div
      class="as-flex as-flex-row as-surface as-surface-4 as-p-4 as-space-x-4 as-rounded-md as-items-center"
    >
      <i-mdi-information class="as-w-6 as-h-6 as-opacity-medium" />
      <p class="as-flex-1 as-body-1">
        Keyboard shortcuts only work inside the Anime Skip video player. If you click outside the
        player then try and use one, it will not work
      </p>
    </div>
    <table class="as-divide-y as-divide-background">
      <tr>
        <th class="as-subtitle-1 as-text-left">Video Controls</th>
        <th class="as-subtitle-1">Primary</th>
        <th class="as-subtitle-1">Secondary</th>
      </tr>
      <KeyboardShortcutRow
        group-top
        name="Play/pause"
        action-name="playPause"
        v-on="{
          updatePrimary: updatePrimaryKeyBinding('playPause'),
          updateSecondary: updateSecondaryKeyBinding('playPause'),
        }"
      />
      <KeyboardShortcutRow
        name="Volume up"
        action-name="volumeUp"
        v-on="{
          updatePrimary: updatePrimaryKeyBinding('volumeUp'),
          updateSecondary: updateSecondaryKeyBinding('volumeUp'),
        }"
      />
      <KeyboardShortcutRow
        name="Volume down"
        action-name="volumeDown"
        v-on="{
          updatePrimary: updatePrimaryKeyBinding('volumeDown'),
          updateSecondary: updateSecondaryKeyBinding('volumeDown'),
        }"
      />
      <KeyboardShortcutRow
        name="Toggle fullscreen"
        action-name="toggleFullscreen"
        v-on="{
          updatePrimary: updatePrimaryKeyBinding('toggleFullscreen'),
          updateSecondary: updateSecondaryKeyBinding('toggleFullscreen'),
        }"
      />
      <KeyboardShortcutRow
        group-bottom
        name="Close dialog"
        action-name="hideDialog"
        v-on="{
          updatePrimary: updatePrimaryKeyBinding('hideDialog'),
          updateSecondary: updateSecondaryKeyBinding('hideDialog'),
        }"
      />
      <tr>
        <th class="as-subtitle-1 as-text-left">Fast Forward</th>
      </tr>
      <KeyboardShortcutRow
        group-top
        name="Advance 2 second"
        action-name="advanceSmall"
        v-on="{
          updatePrimary: updatePrimaryKeyBinding('advanceSmall'),
          updateSecondary: updateSecondaryKeyBinding('advanceSmall'),
        }"
      />
      <KeyboardShortcutRow
        name="Advance 5 seconds"
        action-name="advanceMedium"
        v-on="{
          updatePrimary: updatePrimaryKeyBinding('advanceMedium'),
          updateSecondary: updateSecondaryKeyBinding('advanceMedium'),
        }"
      />
      <KeyboardShortcutRow
        group-bottom
        name="Advance 90 seconds"
        action-name="advanceLarge"
        v-on="{
          updatePrimary: updatePrimaryKeyBinding('advanceLarge'),
          updateSecondary: updateSecondaryKeyBinding('advanceLarge'),
        }"
      />
      <tr>
        <th class="as-subtitle-1 as-text-left">Rewind</th>
      </tr>
      <KeyboardShortcutRow
        group-top
        name="Rewind 2 second"
        action-name="rewindSmall"
        v-on="{
          updatePrimary: updatePrimaryKeyBinding('rewindSmall'),
          updateSecondary: updateSecondaryKeyBinding('rewindSmall'),
        }"
      />
      <KeyboardShortcutRow
        name="Rewind 5 seconds"
        action-name="rewindMedium"
        v-on="{
          updatePrimary: updatePrimaryKeyBinding('rewindMedium'),
          updateSecondary: updateSecondaryKeyBinding('rewindMedium'),
        }"
      />
      <KeyboardShortcutRow
        group-bottom
        name="Rewind 90 seconds"
        action-name="rewindLarge"
        v-on="{
          updatePrimary: updatePrimaryKeyBinding('rewindLarge'),
          updateSecondary: updateSecondaryKeyBinding('rewindLarge'),
        }"
      />
      <tr>
        <th class="as-subtitle-1 as-text-left">Timestamp Editing</th>
      </tr>
      <KeyboardShortcutRow
        group-top
        name="Frame rewind"
        action-name="rewindFrame"
        v-on="{
          updatePrimary: updatePrimaryKeyBinding('rewindFrame'),
          updateSecondary: updateSecondaryKeyBinding('rewindFrame'),
        }"
      />
      <KeyboardShortcutRow
        name="Frame advance"
        action-name="advanceFrame"
        v-on="{
          updatePrimary: updatePrimaryKeyBinding('advanceFrame'),
          updateSecondary: updateSecondaryKeyBinding('advanceFrame'),
        }"
      />
      <KeyboardShortcutRow
        name="Rewind to/edit the previous timestamp"
        action-name="nextTimestamp"
        v-on="{
          updatePrimary: updatePrimaryKeyBinding('nextTimestamp'),
          updateSecondary: updateSecondaryKeyBinding('nextTimestamp'),
        }"
      />
      <KeyboardShortcutRow
        name="Advance to/edit the next timestamp"
        action-name="previousTimestamp"
        v-on="{
          updatePrimary: updatePrimaryKeyBinding('previousTimestamp'),
          updateSecondary: updateSecondaryKeyBinding('previousTimestamp'),
        }"
      />
      <KeyboardShortcutRow
        name="Create timestamp"
        action-name="createTimestamp"
        v-on="{
          updatePrimary: updatePrimaryKeyBinding('createTimestamp'),
          updateSecondary: updateSecondaryKeyBinding('createTimestamp'),
        }"
      />
      <KeyboardShortcutRow
        name="Save timestamps"
        action-name="saveTimestamps"
        v-on="{
          updatePrimary: updatePrimaryKeyBinding('saveTimestamps'),
          updateSecondary: updateSecondaryKeyBinding('saveTimestamps'),
        }"
      />
      <KeyboardShortcutRow
        group-bottom
        name="Discard changes"
        action-name="discardChanges"
        v-on="{
          updatePrimary: updatePrimaryKeyBinding('discardChanges'),
          updateSecondary: updateSecondaryKeyBinding('discardChanges'),
        }"
      />
    </table>
  </div>
</template>

<script lang="ts" setup>
import {
  usePrimaryKeyboardShortcutPrefs,
  useSecondaryKeyboardShortcutPrefs,
} from '~/stores/useKeyboardShortcutPrefs';

// Updates

const { primaryShortcutsActionToKeyMap } = usePrimaryKeyboardShortcutPrefs();
const { secondaryShortcutsActionToKeyMap } = useSecondaryKeyboardShortcutPrefs();

function updatePrimaryKeyBinding(action: string) {
  return (newKeyBinding: string | undefined) => {
    primaryShortcutsActionToKeyMap.value = {
      ...primaryShortcutsActionToKeyMap.value,
      [action]: newKeyBinding,
    };
  };
}
function updateSecondaryKeyBinding(action: string) {
  return (newKeyBinding: string | undefined) => {
    secondaryShortcutsActionToKeyMap.value = {
      ...secondaryShortcutsActionToKeyMap.value,
      [action]: newKeyBinding,
    };
  };
}
</script>

<style scoped>
table {
  @apply as-w-full;
}

table tr td:nth-child(1) {
  @apply as-w-full as-px-4;
}

table tr td:nth-child(2),
table tr td:nth-child(3) {
  @apply as-w-12;
  white-space: nowrap;
}

tr th:first-child {
  @apply as-px-1;
}
tr th {
  @apply as-pt-6 as-pb-3;
}
</style>
