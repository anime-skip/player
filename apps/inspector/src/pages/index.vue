<script setup lang="ts">
const isNetworkTabActive = useIsTabActive('/network');
const isTabsTabActive = useIsTabActive('/tabs');
</script>

<template>
  <header
    class="tabs tabs-sm tabs-lifted flex-1 bg-base-300 shrink-0 grow-0 sticky top-0"
    role="tablist"
  >
    <p class="tab cursor-default">
      <span class="opacity-50 text-xs">Inspector</span>
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
