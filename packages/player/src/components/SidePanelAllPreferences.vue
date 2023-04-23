<script lang="ts" setup>
import SidePanelLayout from './SidePanelLayout.vue';
import Preferences from './Preferences.vue';
</script>

<template>
  <side-panel-layout class="w-[36rem]">
    <template #title>All Settings</template>

    <template #content>
      <preferences size="all" class="p-4" />
    </template>
  </side-panel-layout>
</template>
