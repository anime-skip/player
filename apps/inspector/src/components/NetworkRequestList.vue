<script setup lang="ts">
import NetworkRequestListItem from './NetworkRequestListItem.vue';

const { state: items, isLoading } = useAsyncState<NetworkRequest[]>(
  async () => await messaging.sendMessage('listNetworkRequests', undefined),
  [],
  {
    resetOnExecute: false,
  },
);
const sortedItems = useSorted(items, (a, b) => {
  return a.request.date - b.request.date;
});
</script>

<template>
  <div class="overflow-x-auto">
    <table class="table table-sm">
      <thead>
        <tr>
          <th>Time</th>
          <th>Hostname</th>
          <th class="w-full">Path / Operation</th>
          <th class="text-center">Status</th>
          <th class="text-center">Duration</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="isLoading">
          <td>Loading...</td>
          <td />
          <td />
          <td />
        </tr>
        <NetworkRequestListItem
          v-for="item of sortedItems"
          :key="item.id"
          :request="item"
        />
      </tbody>
    </table>
  </div>
</template>
