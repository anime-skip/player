<template>
  <teleport to="body">
    <scoped-styles-root>
      <div
        v-if="shouldShowReturnButton"
        class="as-fixed as-right-16 as-top-16 as-z-1000000 as-bg-background as-shadow-md as-flex as-flex-row as-items-center as-py-2 as-px-3 as-cursor-pointer as-rounded-lg"
        @click="hideOriginalPlayer()"
      >
        <web-ext-img src="extension-logo/48.png" class="as-w-8 as-h-8 as-mr-3" />
        <P class="as-text-on-surface">Return to Anime Skip</P>
      </div>
    </scoped-styles-root>
  </teleport>
</template>

<script lang="ts" setup>
import { Teleport } from 'vue';
import { useHideOriginalPlayer, useIsOriginalPlayerVisible } from '../state/usePlayerVisibility';

const shouldShowReturnButton = useIsOriginalPlayerVisible();

const hideOriginalPlayer = useHideOriginalPlayer();
</script>

<style lang="scss" scoped>
.as-z-1000000 {
  z-index: 1000000;
}
</style>
