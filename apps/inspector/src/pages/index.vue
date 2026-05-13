<script setup lang="ts">
const isNetworkTabActive = useIsTabActive('/network');
const isTabsTabActive = useIsTabActive('/tabs');
</script>

<template>
  <header
    class="tabs tabs-lifted tabs-sm sticky top-0 flex-1 shrink-0 grow-0 bg-base-300"
    role="tablist"
  >
    <p class="tab cursor-default">
      <span class="text-xs opacity-50">Inspector</span>
    </p>
    <RouterLink
      role="tab"
      class="tab"
      :class="{
        'tab-active': isTabsTabActive,
      }"
      to="/tabs"
    >
      <span>Tabs</span>
    </RouterLink>
    <RouterLink
      role="tab"
      class="tab"
      :class="{
        'tab-active': isNetworkTabActive,
      }"
      to="/network"
    >
      <span>Network</span>
    </RouterLink>
    <div class="tab" />
  </header>

  <RouterView />
</template>

<style>
#app {
  @apply flex flex-col;
}
html,
body,
#app {
  height: 100%;
}
</style>
