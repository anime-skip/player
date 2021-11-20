<template>
  <teleport to="body">
    <scoped-styles-root>
      <div
        v-if="shouldShowReturnButton"
        class="
          fixed
          right-16
          top-16
          z-1000000
          bg-background
          shadow-md
          flex flex-row
          items-center
          py-2
          px-3
          cursor-pointer
          rounded-lg
        "
        @click="hideOriginalPlayer()"
      >
        <web-ext-img src="extension-logo/48.png" class="w-8 h-8 mr-3" />
        <P class="text-on-surface">Return to Anime Skip</P>
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
.z-1000000 {
  z-index: 1000000;
}
</style>
