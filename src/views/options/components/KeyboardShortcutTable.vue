<template>
  <div>
    <h6 class="mb-4">Keyboard Shortcuts</h6>
    <div class="flex flex-row surface surface-4 p-4 space-x-4 rounded-md items-center">
      <Icon
        path="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"
      />
      <p class="flex-1 body-1">
        Keyboard shortcuts only work inside the Anime Skip video player. If you click outside the
        player then try and use one, it will not work
      </p>
    </div>
    <table class="divide-y divide-background">
      <tr>
        <th class="subtitle-1 text-left">Video Controls</th>
        <th class="subtitle-1">Primary</th>
        <th class="subtitle-1">Secondary</th>
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
        v-if="isFirefox"
        name="Take screenshot"
        action-name="takeScreenshot"
        v-on="{
          updatePrimary: updatePrimaryKeyBinding('takeScreenshot'),
          updateSecondary: updateSecondaryKeyBinding('takeScreenshot'),
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
        <th class="subtitle-1 text-left">Fast Forward</th>
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
        <th class="subtitle-1 text-left">Rewind</th>
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
        <th class="subtitle-1 text-left">Timestamp Editing</th>
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
  useUpdatePrimaryKeyBinding,
  useUpdateSecondaryKeyBinding,
} from '~/common/state/useKeyboardShortcutPrefs';
import Browser from '~/common/utils/Browser';

// Updates

const updatePrimaryKeyBinding = useUpdatePrimaryKeyBinding();
const updateSecondaryKeyBinding = useUpdateSecondaryKeyBinding();

// Browser Specific Settings

const isFirefox = Browser.detect() === 'firefox';
</script>

<style scoped>
table {
  @apply w-full;
}

table tr td:nth-child(1) {
  @apply w-full px-4;
}

table tr td:nth-child(2),
table tr td:nth-child(3) {
  @apply w-12;
  white-space: nowrap;
}

tr th:first-child {
  @apply px-1;
}
tr th {
  @apply pt-6 pb-3;
}
</style>
