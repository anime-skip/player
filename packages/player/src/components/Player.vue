<script lang="ts" setup>
import Toolbar from './Toolbar.vue';
import EpisodeInfo from './EpisodeInfo.vue';
import SidePanel from './SidePanel.vue';
import ReturnToPlayerButton from './ReturnToPlayerButton.vue';
import { PlayerVisibility } from '../utils/PlayerVisibility';

const root = ref<HTMLDivElement>();

const isMouseActive = usePlayerMouseActive(root);

const { playing, buffering } = useVideoControls();

const view = useView();
const toolbarModalOpen = computed(
  () => view.value === 'preferences' || view.value === 'account',
);

const visibility = usePlayerVisibility();

useTheme();
useSyncPlaybackRate();
useAutoSkip();

// Preload queries that need ran ASAP
useAllTimestampTypesQuery();
useCurrentUrlQuery();
useFindEpisodeUrlQuery();
useAccountQuery();
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

      <toolbar
        class="absolute bottom-0 inset-x-0"
        :hidden="!isMouseActive && playing && !toolbarModalOpen"
      />
    </div>

    <side-panel class="h-full z-10" />
  </div>

  <!-- Other top level UIs -->
  <return-to-player-button
    v-if="visibility === PlayerVisibility.ServiceSettings"
    class="pointer-events-auto absolute top-16 right-16 z-[9999]"
  />
</template>
