<script lang="ts" setup>
import Preferences from './Preferences.vue';
import SidePanelLayout from './SidePanelLayout.vue';
</script>

<template>
  <side-panel-layout class="w-[36rem]">
    <template #title>All Settings</template>

    <template #content>
      <preferences size="all" class="p-4" />
    </template>
  </side-panel-layout>
</template>
