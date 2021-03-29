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
        top
        name="Play/pause"
        action-name="playPause"
        v-on="{
          updatePrimary: updatePrimaryShortcut('playPause'),
          updateSecondary: updateSecondaryShortcut('playPause'),
        }"
      />
      <KeyboardShortcutRow
        name="Volume up"
        action-name="volumeUp"
        v-on="{
          updatePrimary: updatePrimaryShortcut('volumeUp'),
          updateSecondary: updateSecondaryShortcut('volumeUp'),
        }"
      />
      <KeyboardShortcutRow
        name="Volume down"
        action-name="volumeDown"
        v-on="{
          updatePrimary: updatePrimaryShortcut('volumeDown'),
          updateSecondary: updateSecondaryShortcut('volumeDown'),
        }"
      />
      <KeyboardShortcutRow
        name="Toggle fullscreen"
        action-name="toggleFullscreen"
        v-on="{
          updatePrimary: updatePrimaryShortcut('toggleFullscreen'),
          updateSecondary: updateSecondaryShortcut('toggleFullscreen'),
        }"
      />
      <KeyboardShortcutRow
        bottom
        name="Close dialog"
        action-name="hideDialog"
        v-on="{
          updatePrimary: updatePrimaryShortcut('hideDialog'),
          updateSecondary: updateSecondaryShortcut('hideDialog'),
        }"
      />
      <tr>
        <th class="subtitle-1 text-left">Fast Forward</th>
      </tr>
      <KeyboardShortcutRow
        top
        name="Advance 2 second"
        action-name="advanceSmall"
        v-on="{
          updatePrimary: updatePrimaryShortcut('advanceSmall'),
          updateSecondary: updateSecondaryShortcut('advanceSmall'),
        }"
      />
      <KeyboardShortcutRow
        name="Advance 5 seconds"
        action-name="advanceMedium"
        v-on="{
          updatePrimary: updatePrimaryShortcut('advanceMedium'),
          updateSecondary: updateSecondaryShortcut('advanceMedium'),
        }"
      />
      <KeyboardShortcutRow
        bottom
        name="Advance 90 seconds"
        action-name="advanceLarge"
        v-on="{
          updatePrimary: updatePrimaryShortcut('advanceLarge'),
          updateSecondary: updateSecondaryShortcut('advanceLarge'),
        }"
      />
      <tr>
        <th class="subtitle-1 text-left">Rewind</th>
      </tr>
      <KeyboardShortcutRow
        top
        name="Rewind 2 second"
        action-name="rewindSmall"
        v-on="{
          updatePrimary: updatePrimaryShortcut('rewindSmall'),
          updateSecondary: updateSecondaryShortcut('rewindSmall'),
        }"
      />
      <KeyboardShortcutRow
        name="Rewind 5 seconds"
        action-name="rewindMedium"
        v-on="{
          updatePrimary: updatePrimaryShortcut('rewindMedium'),
          updateSecondary: updateSecondaryShortcut('rewindMedium'),
        }"
      />
      <KeyboardShortcutRow
        bottom
        name="Rewind 90 seconds"
        action-name="rewindLarge"
        v-on="{
          updatePrimary: updatePrimaryShortcut('rewindLarge'),
          updateSecondary: updateSecondaryShortcut('rewindLarge'),
        }"
      />
      <tr>
        <th class="subtitle-1 text-left">Timestamp Editing</th>
      </tr>
      <KeyboardShortcutRow
        top
        name="Frame rewind"
        action-name="rewindFrame"
        v-on="{
          updatePrimary: updatePrimaryShortcut('rewindFrame'),
          updateSecondary: updateSecondaryShortcut('rewindFrame'),
        }"
      />
      <KeyboardShortcutRow
        name="Frame advance"
        action-name="advanceFrame"
        v-on="{
          updatePrimary: updatePrimaryShortcut('advanceFrame'),
          updateSecondary: updateSecondaryShortcut('advanceFrame'),
        }"
      />
      <KeyboardShortcutRow
        name="Rewind to/edit the previous timestamp"
        action-name="nextTimestamp"
        v-on="{
          updatePrimary: updatePrimaryShortcut('nextTimestamp'),
          updateSecondary: updateSecondaryShortcut('nextTimestamp'),
        }"
      />
      <KeyboardShortcutRow
        name="Advance to/edit the next timestamp"
        action-name="previousTimestamp"
        v-on="{
          updatePrimary: updatePrimaryShortcut('previousTimestamp'),
          updateSecondary: updateSecondaryShortcut('previousTimestamp'),
        }"
      />
      <KeyboardShortcutRow
        name="Create timestamp"
        action-name="createTimestamp"
        v-on="{
          updatePrimary: updatePrimaryShortcut('createTimestamp'),
          updateSecondary: updateSecondaryShortcut('createTimestamp'),
        }"
      />
      <KeyboardShortcutRow
        name="Save timestamps"
        action-name="saveTimestamps"
        v-on="{
          updatePrimary: updatePrimaryShortcut('saveTimestamps'),
          updateSecondary: updateSecondaryShortcut('saveTimestamps'),
        }"
      />
      <KeyboardShortcutRow
        bottom
        name="Discard changes"
        action-name="discardChanges"
        v-on="{
          updatePrimary: updatePrimaryShortcut('discardChanges'),
          updateSecondary: updateSecondaryShortcut('discardChanges'),
        }"
      />
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import KeyboardShortcutRow from './KeyboardShortcutRow.vue';
import { MutationTypes } from '@/common/store/mutationTypes';

export default defineComponent({
  components: { KeyboardShortcutRow },
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
