<script lang="ts" setup>
import { PreferencesKeyboardShortcutsView } from '../utils/preferences';
import KeyboardShortcutRow from './KeyboardShortcutRow.vue';

defineProps<{
  view: PreferencesKeyboardShortcutsView;
}>();
</script>

<template>
  <table class="divide-y divide-base-100">
    <tr class="h-12">
      <th class="text-sm font-medium text-left">Video Controls</th>
      <th class="text-sm font-medium">Primary</th>
      <th class="text-sm font-medium">Secondary</th>
    </tr>
    <keyboard-shortcut-row group-top label="Play/pause" action="playPause" />
    <keyboard-shortcut-row label="Volume up" action="volumeUp" />
    <keyboard-shortcut-row label="Volume down" action="volumeDown" />
    <keyboard-shortcut-row
      label="Increase playback rate"
      action="playbackRateUp"
    />
    <keyboard-shortcut-row
      label="Decrease playback rate"
      action="playbackRateDown"
    />
    <keyboard-shortcut-row
      label="Toggle fullscreen"
      action="toggleFullscreen"
    />
    <keyboard-shortcut-row
      group-bottom
      label="Close dialog"
      action="hideDialog"
    />
    <tr class="h-12">
      <th class="text-sm font-medium text-left">Fast Forward</th>
    </tr>
    <keyboard-shortcut-row
      group-top
      label="Advance 2 second"
      action="advanceSmall"
    />
    <keyboard-shortcut-row label="Advance 5 seconds" action="advanceMedium" />
    <keyboard-shortcut-row
      group-bottom
      label="Advance 90 seconds"
      action="advanceLarge"
    />
    <tr class="h-12">
      <th class="text-sm font-medium text-left">Rewind</th>
    </tr>
    <keyboard-shortcut-row
      group-top
      label="Rewind 2 second"
      action="rewindSmall"
    />
    <keyboard-shortcut-row label="Rewind 5 seconds" action="rewindMedium" />
    <keyboard-shortcut-row
      group-bottom
      label="Rewind 90 seconds"
      action="rewindLarge"
    />
    <tr class="h-12">
      <th class="text-sm font-medium text-left">Timestamp Editing</th>
    </tr>
    <keyboard-shortcut-row
      group-top
      label="Create timestamp"
      action="createTimestamp"
    />
    <keyboard-shortcut-row label="Frame rewind" action="rewindFrame" />
    <keyboard-shortcut-row label="Frame advance" action="advanceFrame" />
    <keyboard-shortcut-row
      label="Rewind to/edit the previous timestamp"
      action="nextTimestamp"
    />
    <keyboard-shortcut-row
      label="Advance to/edit the next timestamp"
      action="previousTimestamp"
    />
    <keyboard-shortcut-row label="Save timestamps" action="saveTimestamps" />
    <keyboard-shortcut-row
      group-bottom
      label="Discard changes"
      action="discardChanges"
    />
  </table>
</template>
