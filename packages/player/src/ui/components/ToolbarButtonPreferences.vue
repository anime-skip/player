<script lang="ts" setup>
import IconGear from '~icons/anime-skip/gear';

import Preferences from './Preferences.vue';
import ToolbarButton from './ToolbarButton.vue';
import ToolbarModal from './ToolbarModal.vue';
</script>

<template>
  <toolbar-modal view="preferences" modal-class="h-72">
    <!-- Button -->
    <template #button="{ toggle }">
      <toolbar-button title="Settings" @click="toggle">
        <icon-gear />
      </toolbar-button>
    </template>

    <!-- Modal -->
    <template #modal>
      <div class="w-96 p-4">
        <preferences size="small" />
      </div>
    </template>
  </toolbar-modal>
</template>
