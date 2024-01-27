<script lang="ts" setup>
import Toolbar from './Toolbar.vue';
import EpisodeInfo from './EpisodeInfo.vue';
import SidePanel from './SidePanel.vue';
import ReturnToPlayerButton from './ReturnToPlayerButton.vue';
import { PlayerVisibility } from '../utils/PlayerVisibility';
import ManualSkipButton from './ManualSkipButton.vue';
import { QueryKey } from '../utils/QueryKey';
import ContextMenu from './ContextMenu.vue';
import ScreenshotPreview from './ScreenshotPreview.vue';
import { PlayerEvent } from '../utils/PlayerEvent';

const root = ref<HTMLDivElement>();

const isMouseActive = usePlayerMouseActive(root);

const { playing, buffering } = useVideoControls();

const { view } = useView();
const toolbarModalOpen = computed(
  () => view.value === 'preferences' || view.value === 'account',
);
const { disableContextMenu } = usePlayerOptions();

const visibility = usePlayerVisibility();

const { isEditing } = useIsEditing();
const { pref: minimizeToolbarWhenEditing } = useReadonlyPreference(
  'minimizeToolbarWhenEditing',
);

const isToolbarHidden = computed(
  () =>
    !isMouseActive.value &&
    playing.value &&
    !toolbarModalOpen.value &&
    (!isEditing.value || !!minimizeToolbarWhenEditing.value),
);

useTheme();
useSyncPlaybackRate();
useAutoSkip();
useKeyboardActions();
useAutoconnectEpisode();

// Preload queries that need ran ASAP
useAllTimestampTypesQuery();
useAccountQuery();

// URL change behavior
const client = useQueryClient();
const { data: url } = useCurrentUrlQuery();
const discardChanges = useDiscardChanges();

watch(url, () => {
  client.invalidateQueries(QueryKey.EpisodeInfo);
  if (isEditing.value) {
    // TODO: Don't discard changes, ask if the user wants to save their changes for the previous episode
    discardChanges();
  }
});

const preview = useScreenshotPreview();

useCustomEventListener<PlayerEvent>(PlayerEvent.TYPE, ({ detail }) => {
  switch (detail.type) {
    case 'setPlayerVisibility':
      visibility.value = detail.visibility;
      break;
    case 'showScreenshot':
      preview.value = detail.url;
      break;
  }
});
</script>

<template>
  <!-- Player -->
  <div
    v-show="visibility === PlayerVisibility.Visible"
    class="w-full h-full pointer-events-auto flex"
  >
    <div
      ref="root"
      class="relative transition-colors flex-1"
      :class="{
        'bg-base-100 bg-opacity-50': !playing || buffering,
        'cursor-none': isToolbarHidden,
      }"
      @click="playing = !playing"
    >
      <div
        v-if="playing && buffering"
        class="flex absolute inset-0 pointer-events-none"
      >
        <div class="spinner w-16 h-16 m-auto" />
      </div>

      <episode-info class="absolute top-0 inset-x-0" :hidden="playing" />

      <toolbar class="absolute bottom-0 inset-x-0" :hidden="isToolbarHidden" />

      <manual-skip-button class="absolute bottom-20 right-4" />

      <screenshot-preview />
    </div>

    <side-panel class="h-full z-10" />

    <context-menu v-if="!disableContextMenu" />
  </div>

  <!-- Other top level UIs -->
  <return-to-player-button
    v-if="visibility === PlayerVisibility.ServiceSettings"
    class="pointer-events-auto absolute top-16 right-16 z-[9999]"
  />
</template>
