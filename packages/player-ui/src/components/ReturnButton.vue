<template>
  <teleport to="body">
    <scoped-styles-root>
      <div
        v-if="playerVisibility.serviceUi"
        class="as-fixed as-right-16 as-top-16 as-z-1000000 as-bg-background as-shadow-md as-flex as-flex-row as-items-center as-py-2 as-px-3 as-cursor-pointer as-rounded-lg"
        @click="showAnimeSkipUi()"
      >
        <themed-logo class="as-w-8 as-h-8 as-mr-3" />
        <p class="as-text-on-surface">Return to Anime Skip</p>
      </div>
    </scoped-styles-root>
  </teleport>
</template>

<script lang="ts" setup>
import { Teleport } from 'vue';
import { usePlayerVisibilityStore } from '../state/stores/usePlayerVisibilityStore';

const playerVisibility = usePlayerVisibilityStore();

function showAnimeSkipUi() {
  playerVisibility.animeSkipUi = true;
  playerVisibility.serviceUi = false;
}
</script>

<style lang="scss" scoped>
.as-z-1000000 {
  z-index: 1000000;
}
</style>
