<script lang="ts" setup>
import ToolbarButton from './ToolbarButton.vue';
import Settings from './Settings.vue';
import IconGear from '~icons/anime-skip/gear';
import ToolbarModal from './ToolbarModal.vue';
</script>

<template>
  <toolbar-modal view="settings" modal-class="w-96 h-72">
    <!-- Button -->
    <template #button="{ toggle }">
      <toolbar-button title="Settings" @click="toggle">
        <icon-gear />
      </toolbar-button>
    </template>

    <!-- Modal -->
    <template #modal>
      <settings size="small" />
    </template>
  </toolbar-modal>
</template>
