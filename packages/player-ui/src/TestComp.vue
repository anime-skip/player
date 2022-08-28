<template>
  <teleport to="body">
    <div>
      <pre>{{
        JSON.stringify(
          {
            auth,
            tabUrl,
            dialogs,
            videoState,
            playHistory,
            crawled,
            activity,
            episode,
            templateEditing,
            timestampEditing,
            keyboardShortcuts,
            focusedTimestamp,
            playerVisibility,
            suggestedEpisodes,
          },
          null,
          2
        )
      }}</pre>
    </div>
  </teleport>
</template>

<script lang="ts" setup>
import { useAuthStore } from './state/stores/useAuthStore';
import { useCrawlEpisodeStore } from './state/stores/useCrawledEpisodeStore';
import { useDialogStore } from './state/stores/useDialogStore';
import { useEpisodeStore } from './state/stores/useEpisodeStore';
import { useFocusedTimestampStore } from './state/stores/useFocusedTimestampStore';
import { useKeyboardShortcutStore } from './state/stores/useKeyboardShortcutStore';
import { usePlayerVisibilityStore } from './state/stores/usePlayerVisibilityStore';
import { usePlayHistoryStore } from './state/stores/usePlayHistoryStore';
import { useSuggestedEpisodesStore } from './state/stores/useSuggestedEpisodesStore';
import { useTabUrlStore } from './state/stores/useTabUrlStore';
import { useTemplateEditingStore } from './state/stores/useTemplateEditingStore';
import { useTimestampEditingStore } from './state/stores/useTimestampEditingStore';
import { useUserActivityStore } from './state/stores/useUserActivityStore';
import { useVideoStateStore } from './state/stores/useVideoStateStore';

const auth = useAuthStore();
const tabUrl = useTabUrlStore();
const dialogs = useDialogStore();
const videoState = useVideoStateStore();
const playHistory = usePlayHistoryStore();
const crawled = useCrawlEpisodeStore();
const activity = useUserActivityStore();
const templateEditing = useTemplateEditingStore();
const timestampEditing = useTimestampEditingStore();
const episode = useEpisodeStore();
const keyboardShortcuts = useKeyboardShortcutStore();
const focusedTimestamp = useFocusedTimestampStore();
const playerVisibility = usePlayerVisibilityStore();
const suggestedEpisodes = useSuggestedEpisodesStore();
</script>
