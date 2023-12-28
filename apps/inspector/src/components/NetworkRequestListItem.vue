<script setup lang="ts">
import { NetworkRequest } from '@/utils/network-repo';
import { computed } from 'vue';

const props = defineProps<{
  request: NetworkRequest;
}>();

const router = useRouter();
const route = useRoute();
const detailsUrl = computed(() => `/network/${props.request.id}`);
const isActive = computed(() => route.path === detailsUrl.value);
function onClickItem() {
  if (isActive.value) router.push('/network');
  else router.push(detailsUrl.value);
}

const url = computed(() => new URL(props.request.request.url));
const pathOrOperation = computed(() => {
  let operationName: string | undefined;
  try {
    operationName = JSON.parse(props.request.request.body).operationName;
  } catch {}
  return operationName ? 'GraphQL: ' + operationName : url.value.pathname;
});
const timeAgo = useTimeAgo(() => props.request.request.date);
</script>

<template>
  <tr
    class="cursor-pointer transition-colors select-none hover:bg-base-200 active:bg-base-300"
    :class="{
      'bg-base-300 hover:bg-base-300': isActive,
    }"
    @click="onClickItem"
  >
    <td class="whitespace-nowrap">{{ timeAgo }}</td>
    <th class="whitespace-nowrap">{{ url.hostname }}</th>
    <td>
      <p class="line-clamp-1 max-w-[50vw]">{{ pathOrOperation }}</p>
    </td>
    <template v-if="request.response">
      <td class="text-center whitespace-nowrap">
        {{ request.response.status }} {{ request.response.statusText }}
      </td>
      <td class="text-center whitespace-nowrap">
        {{ request.response.duration }} ms
      </td>
    </template>
    <template v-else>
      <td colspan="2" class="text-center whitespace-nowrap">Pending...</td>
    </template>
  </tr>
</template>
