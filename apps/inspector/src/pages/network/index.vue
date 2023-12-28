<script setup lang="ts">
import NetworkRequestList from '@/components/NetworkRequestList.vue';
import ScrollContainer from '@/components/ScrollContainer.vue';
</script>

<template>
  <ScrollContainer>
    <NetworkRequestList />
  </ScrollContainer>
  <RouterView />
</template>
