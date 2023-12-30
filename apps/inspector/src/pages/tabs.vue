<script setup lang="ts">
const { state: tabs, execute } = useAsyncState(
  async () => messaging.sendMessage('getTabs', undefined),
  [],
  {
    resetOnExecute: false,
  },
);
useIntervalFn(execute, 1e3);
</script>

<template>
  <table class="table table-sm">
    <thead>
      <tr>
        <th class="text-center">Tab ID</th>
        <th class="text-center">Frame ID</th>
        <th class="w-full">URL</th>
      </tr>
    </thead>
    <tbody>
      <template v-for="{ tab, frames } of tabs" :key="tab.id">
        <tr>
          <td class="font-mono text-center">
            {{ tab.id }}
          </td>
          <td class="text-center">-</td>
          <td class="flex items-center gap-2">
            <img v-if="tab.favIconUrl" class="h-6" :src="tab.favIconUrl" />
            <span>{{ tab.url ?? tab.pendingUrl }}</span>
          </td>
        </tr>
        <tr v-for="frame of frames">
          <td></td>
          <td class="font-mono text-center">{{ frame.frameId }}</td>
          <td class="flex items-center gap-2">
            <span>{{ frame.url }}</span>
          </td>
        </tr>
      </template>
    </tbody>
  </table>
</template>
