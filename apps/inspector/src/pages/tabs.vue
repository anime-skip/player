<script setup lang="ts">
const { state: tabs, execute } = useAsyncState(
  async () => messaging.sendMessage('getTabs', undefined),
  [],
  {
    resetOnExecute: false,
  },
);
useIntervalFn(execute, 1e3);

async function copyBody(
  tabId: number | undefined,
  targetUrl: string | undefined,
) {
  const body = await messaging.sendMessage('getFrameBodyInnerHtml', {
    tabId,
    targetUrl,
  });
  copy(body);
}
const { copy } = useClipboard();
</script>

<template>
  <div class="overflow-x-auto">
    <table class="table table-sm">
      <thead>
        <tr>
          <th class="text-center">Tab ID</th>
          <th class="text-center">Frame ID</th>
          <th>URL</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="{ tab, frames } of tabs" :key="tab.id">
          <tr>
            <td class="font-mono text-center">
              {{ tab.id }}
            </td>
            <td class="text-center whitespace-nowrap">-</td>
            <td>
              <div class="flex items-center gap-2">
                <img v-if="tab.favIconUrl" class="h-6" :src="tab.favIconUrl" />
                <span class="line-clamp-1 break-all">{{
                  tab.url ?? tab.pendingUrl
                }}</span>
              </div>
            </td>
            <td>
              <button
                class="btn btn-sm whitespace-nowrap"
                @click="copyBody(tab.id, tab.url ?? tab.pendingUrl)"
              >
                Copy Body
              </button>
            </td>
          </tr>
          <tr v-for="frame of frames">
            <td />
            <td class="font-mono text-center">
              {{ frame.frameId }}
            </td>
            <td class="line-clamp-1 break-all">{{ frame.url }}</td>
            <td>
              <button
                class="btn btn-sm whitespace-nowrap"
                @click="copyBody(tab.id, frame.url)"
              >
                Copy Body
              </button>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>
