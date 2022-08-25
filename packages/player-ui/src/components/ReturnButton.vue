<template>
  <teleport to="body">
    <scoped-styles-root>
      <div
        v-if="shouldShowReturnButton"
        class="as-fixed as-right-16 as-top-16 as-z-1000000 as-bg-background as-shadow-md as-flex as-flex-row as-items-center as-py-2 as-px-3 as-cursor-pointer as-rounded-lg"
        @click="hideOriginalPlayer()"
      >
        <themed-logo class="as-w-8 as-h-8 as-mr-3" />
        <p class="as-text-on-surface">Return to Anime Skip</p>
      </div>
    </scoped-styles-root>
  </teleport>
</template>

<script lang="ts" setup>
import { Teleport } from 'vue';
import { useHideOriginalPlayer, useIsOriginalPlayerVisible } from '../stores/usePlayerVisibility';

const shouldShowReturnButton = useIsOriginalPlayerVisible();

const hideOriginalPlayer = useHideOriginalPlayer();
</script>

<style lang="scss" scoped>
.as-z-1000000 {
  z-index: 1000000;
}
</style>
