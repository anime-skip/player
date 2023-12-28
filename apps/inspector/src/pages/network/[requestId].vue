<script setup lang="ts">
import NetworkRequestDetails from '@/components/NetworkRequestDetails.vue';
import ScrollContainer from '@/components/ScrollContainer.vue';
import { watch, computed } from 'vue';

const route = useRoute();
const id = computed(() => route.params.requestId as string);

const {
  state: request,
  isLoading,
  execute,
} = useAsyncState(
  async () => await messaging.sendMessage('getNetworkRequest', id.value),
  undefined,
);
watch(id, () => execute());

const router = useRouter();
useEventListener('keydown', (event) => {
  if (event.key === 'Escape') router.back();
});
</script>

<template>
  <ScrollContainer class="border-t-2 border-neutral bg-base-200">
    <div
      class="flex gap-4 items-center border-b border-base-300 px-2 py-1 sticky top-0 bg-base-200"
    >
      <h2 class="font-bold line-clamp-1 flex-1">Request Details</h2>
      <RouterLink class="btn btn-circle btn-ghost btn-sm" to="/network">
        <span>&times;</span>
      </RouterLink>
    </div>
    <p v-if="isLoading">Loading...</p>
    <NetworkRequestDetails v-else-if="request" :request="request" />
  </ScrollContainer>
</template>
