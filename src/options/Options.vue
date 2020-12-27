<template>
  <div class="Options">
    <div class="column">
      <PopupHeader title="Keyboard Shortcuts" />
      <h4 class="header">
        <span class="column1">General</span>
        <span class="column2">Primary</span>
        <span class="column3">Secondary</span>
      </h4>
      <div>
        <KeyboardShortcutItem
          name="Play/pause"
          actionName="playPause"
          v-on="{
            updatePrimary: updatePrimaryShortcut('playPause'),
            updateSecondary: updateSecondaryShortcut('playPause'),
          }"
        />
        <KeyboardShortcutItem
          name="Volume up"
          actionName="volumeUp"
          v-on="{
            updatePrimary: updatePrimaryShortcut('volumeUp'),
            updateSecondary: updateSecondaryShortcut('volumeUp'),
          }"
        />
        <KeyboardShortcutItem
          name="Volume down"
          actionName="volumeDown"
          v-on="{
            updatePrimary: updatePrimaryShortcut('volumeDown'),
            updateSecondary: updateSecondaryShortcut('volumeDown'),
          }"
        />
        <KeyboardShortcutItem
          name="Toggle fullscreen"
          actionName="toggleFullscreen"
          v-on="{
            updatePrimary: updatePrimaryShortcut('toggleFullscreen'),
            updateSecondary: updateSecondaryShortcut('toggleFullscreen'),
          }"
        />
        <KeyboardShortcutItem
          name="Close dialog"
          actionName="hideDialog"
          v-on="{
            updatePrimary: updatePrimaryShortcut('hideDialog'),
            updateSecondary: updateSecondaryShortcut('hideDialog'),
          }"
        />
      </div>
      <h4 class="header">Fast Forward</h4>
      <div>
        <KeyboardShortcutItem
          name="Advance 2 second"
          actionName="advanceSmall"
          v-on="{
            updatePrimary: updatePrimaryShortcut('advanceSmall'),
            updateSecondary: updateSecondaryShortcut('advanceSmall'),
          }"
        />
        <KeyboardShortcutItem
          name="Advance 5 seconds"
          actionName="advanceMedium"
          v-on="{
            updatePrimary: updatePrimaryShortcut('advanceMedium'),
            updateSecondary: updateSecondaryShortcut('advanceMedium'),
          }"
        />
        <KeyboardShortcutItem
          name="Advance 90 seconds"
          actionName="advanceLarge"
          v-on="{
            updatePrimary: updatePrimaryShortcut('advanceLarge'),
            updateSecondary: updateSecondaryShortcut('advanceLarge'),
          }"
        />
      </div>
      <h4 class="header">Rewind</h4>
      <div>
        <KeyboardShortcutItem
          name="Rewind 2 second"
          actionName="rewindSmall"
          v-on="{
            updatePrimary: updatePrimaryShortcut('rewindSmall'),
            updateSecondary: updateSecondaryShortcut('rewindSmall'),
          }"
        />
        <KeyboardShortcutItem
          name="Rewind 5 seconds"
          actionName="rewindMedium"
          v-on="{
            updatePrimary: updatePrimaryShortcut('rewindMedium'),
            updateSecondary: updateSecondaryShortcut('rewindMedium'),
          }"
        />
        <KeyboardShortcutItem
          name="Rewind 90 seconds"
          actionName="rewindLarge"
          v-on="{
            updatePrimary: updatePrimaryShortcut('rewindLarge'),
            updateSecondary: updateSecondaryShortcut('rewindLarge'),
          }"
        />
      </div>
      <h4 class="header">Editing</h4>
      <div>
        <KeyboardShortcutItem
          name="Frame rewind"
          actionName="rewindFrame"
          v-on="{
            updatePrimary: updatePrimaryShortcut('rewindFrame'),
            updateSecondary: updateSecondaryShortcut('rewindFrame'),
          }"
        />
        <KeyboardShortcutItem
          name="Frame advance"
          actionName="advanceFrame"
          v-on="{
            updatePrimary: updatePrimaryShortcut('advanceFrame'),
            updateSecondary: updateSecondaryShortcut('advanceFrame'),
          }"
        />
        <KeyboardShortcutItem
          name="Rewind to/edit the previous timestamp"
          actionName="nextTimestamp"
          v-on="{
            updatePrimary: updatePrimaryShortcut('nextTimestamp'),
            updateSecondary: updateSecondaryShortcut('nextTimestamp'),
          }"
        />
        <KeyboardShortcutItem
          name="Advance to/edit the next timestamp"
          actionName="previousTimestamp"
          v-on="{
            updatePrimary: updatePrimaryShortcut('previousTimestamp'),
            updateSecondary: updateSecondaryShortcut('previousTimestamp'),
          }"
        />
        <KeyboardShortcutItem
          name="Create timestamp"
          actionName="createTimestamp"
          v-on="{
            updatePrimary: updatePrimaryShortcut('createTimestamp'),
            updateSecondary: updateSecondaryShortcut('createTimestamp'),
          }"
        />
        <KeyboardShortcutItem
          name="Save timestamps"
          actionName="saveTimestamps"
          v-on="{
            updatePrimary: updatePrimaryShortcut('saveTimestamps'),
            updateSecondary: updateSecondaryShortcut('saveTimestamps'),
          }"
        />
        <KeyboardShortcutItem
          name="Discard changes"
          actionName="discardChanges"
          v-on="{
            updatePrimary: updatePrimaryShortcut('discardChanges'),
            updateSecondary: updateSecondaryShortcut('discardChanges'),
          }"
        />
      </div>
      <div class="help">
        <WebExtImg src="ic_help.svg" />
        <p>
          Keyboard shortcuts only work inside the Anime Skip video player. If you click outside the
          player then try and use one, it will not work
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PopupHeader from '@/popup/components/PopupHeader.vue';
import KeyboardShortcutItem from './components/KeyboardShortcutItem.vue';
import WebExtImg from '@/common/components/WebExtImg.vue';
import { MutationTypes } from '@/common/store/mutationTypes';

export default defineComponent({
  components: { KeyboardShortcutItem, PopupHeader, WebExtImg },
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

<style lang="scss" scoped>
.Options {
  display: flex;
  flex-direction: column;
  padding: 24px;

  .column {
    width: 100%;
    max-width: 700px;
    align-self: center;
    & > * {
      margin-bottom: 16px;
    }
  }

  .help {
    display: flex;
    flex-direction: row;
    border-radius: 8px;
    padding: 16px;
    background-color: $background300;
    align-items: center;
    margin-top: 48px;

    img {
      width: 24px;
      height: 24px;
      margin-right: 24px;
      opacity: 64%;
    }

    p {
      flex: 1;
    }
  }

  .header {
    color: $textPrimary;
    display: flex;
    flex-direction: row;
    padding-top: 16px;
  }

  .column1 {
    flex-grow: 3;
    flex-basis: 0;
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
