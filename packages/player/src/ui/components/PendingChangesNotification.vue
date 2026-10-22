<script lang="ts" setup>
import type { SaveContext } from '../composables/useGetLiveContext';

const { pending, remove } = usePendingChanges();
const { mutateAsync: saveChanges, isLoading } = useSaveChangesMutation();
const { state: auth } = useAuth();

const current = computed(() => pending.value[0]);

const description = computed(() => {
  const ctx = current.value;
  if (!ctx) return '';
  const name = [ctx.showName.trim(), ctx.episodeName.trim()]
    .filter(Boolean)
    .join(' - ');
  return name || 'the previous episode';
});

async function save(ctx: SaveContext) {
  try {
    await saveChanges(ctx);
    remove(ctx);
  } catch {
    // Keep the notification (and changes) around if saving fails
  }
}
</script>

<template>
  <div
    v-if="current"
    class="flex w-64 flex-col gap-2 rounded bg-base-200 p-3 text-sm shadow-xl"
    @click.stop
  >
    <h4 class="text-base font-bold">Unsaved Changes</h4>
    <p class="break-words">
      {{ description }}
    </p>
    <p v-if="!auth" class="text-warning">Log in to save these changes.</p>
    <div class="flex gap-2">
      <button
        class="btn btn-primary btn-sm flex-1"
        :class="{ loading: isLoading }"
        :disabled="isLoading || !auth"
        @click="save(current)"
      >
        Save
      </button>
      <button
        class="btn btn-sm flex-1 hover:btn-error"
        :disabled="isLoading"
        @click="remove(current)"
      >
        Discard
      </button>
    </div>
  </div>
</template>
