<template>
  <div>
    <h6 class="mb-4">Keyboard Shortcuts</h6>
    <div class="flex flex-row surface surface-4 p-4 space-x-4 rounded-md items-center">
      <Icon
        path="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"
      />
      <p class="flex-1">
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
        actionName="playPause"
        v-on="{
          updatePrimary: updatePrimaryShortcut('playPause'),
          updateSecondary: updateSecondaryShortcut('playPause'),
        }"
      />
      <KeyboardShortcutRow
        name="Volume up"
        actionName="volumeUp"
        v-on="{
          updatePrimary: updatePrimaryShortcut('volumeUp'),
          updateSecondary: updateSecondaryShortcut('volumeUp'),
        }"
      />
      <KeyboardShortcutRow
        name="Volume down"
        actionName="volumeDown"
        v-on="{
          updatePrimary: updatePrimaryShortcut('volumeDown'),
          updateSecondary: updateSecondaryShortcut('volumeDown'),
        }"
      />
      <KeyboardShortcutRow
        name="Toggle fullscreen"
        actionName="toggleFullscreen"
        v-on="{
          updatePrimary: updatePrimaryShortcut('toggleFullscreen'),
          updateSecondary: updateSecondaryShortcut('toggleFullscreen'),
        }"
      />
      <KeyboardShortcutRow
        bottom
        name="Close dialog"
        actionName="hideDialog"
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
        actionName="advanceSmall"
        v-on="{
          updatePrimary: updatePrimaryShortcut('advanceSmall'),
          updateSecondary: updateSecondaryShortcut('advanceSmall'),
        }"
      />
      <KeyboardShortcutRow
        name="Advance 5 seconds"
        actionName="advanceMedium"
        v-on="{
          updatePrimary: updatePrimaryShortcut('advanceMedium'),
          updateSecondary: updateSecondaryShortcut('advanceMedium'),
        }"
      />
      <KeyboardShortcutRow
        bottom
        name="Advance 90 seconds"
        actionName="advanceLarge"
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
        actionName="rewindSmall"
        v-on="{
          updatePrimary: updatePrimaryShortcut('rewindSmall'),
          updateSecondary: updateSecondaryShortcut('rewindSmall'),
        }"
      />
      <KeyboardShortcutRow
        name="Rewind 5 seconds"
        actionName="rewindMedium"
        v-on="{
          updatePrimary: updatePrimaryShortcut('rewindMedium'),
          updateSecondary: updateSecondaryShortcut('rewindMedium'),
        }"
      />
      <KeyboardShortcutRow
        bottom
        name="Rewind 90 seconds"
        actionName="rewindLarge"
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
        actionName="rewindFrame"
        v-on="{
          updatePrimary: updatePrimaryShortcut('rewindFrame'),
          updateSecondary: updateSecondaryShortcut('rewindFrame'),
        }"
      />
      <KeyboardShortcutRow
        name="Frame advance"
        actionName="advanceFrame"
        v-on="{
          updatePrimary: updatePrimaryShortcut('advanceFrame'),
          updateSecondary: updateSecondaryShortcut('advanceFrame'),
        }"
      />
      <KeyboardShortcutRow
        name="Rewind to/edit the previous timestamp"
        actionName="nextTimestamp"
        v-on="{
          updatePrimary: updatePrimaryShortcut('nextTimestamp'),
          updateSecondary: updateSecondaryShortcut('nextTimestamp'),
        }"
      />
      <KeyboardShortcutRow
        name="Advance to/edit the next timestamp"
        actionName="previousTimestamp"
        v-on="{
          updatePrimary: updatePrimaryShortcut('previousTimestamp'),
          updateSecondary: updateSecondaryShortcut('previousTimestamp'),
        }"
      />
      <KeyboardShortcutRow
        name="Create timestamp"
        actionName="createTimestamp"
        v-on="{
          updatePrimary: updatePrimaryShortcut('createTimestamp'),
          updateSecondary: updateSecondaryShortcut('createTimestamp'),
        }"
      />
      <KeyboardShortcutRow
        name="Save timestamps"
        actionName="saveTimestamps"
        v-on="{
          updatePrimary: updatePrimaryShortcut('saveTimestamps'),
          updateSecondary: updateSecondaryShortcut('saveTimestamps'),
        }"
      />
      <KeyboardShortcutRow
        bottom
        name="Discard changes"
        actionName="discardChanges"
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
import PopupHeader from '@/popup/components/PopupHeader.vue';
import KeyboardShortcutRow from './KeyboardShortcutRow.vue';
import WebExtImg from '@/common/components/WebExtImg.vue';
import { MutationTypes } from '@/common/store/mutationTypes';

export default defineComponent({
  components: { KeyboardShortcutRow, PopupHeader, WebExtImg },
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
