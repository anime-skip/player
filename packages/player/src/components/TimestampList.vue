<script lang="ts" setup>
import TimestampListItem from './TimestampListItem.vue';
import IconPlus from '~icons/anime-skip/plus';

const props = defineProps<{
  disabled?: boolean;
}>();

const timestamps = useCurrentTimestamps();
const { isLoading, isError, error } = useFindEpisodeUrlQuery();
const errorMessage = useErrorMessage(error);
</script>

<template>
  <div class="p-2">
    <!-- Loading -->
    <div v-if="isLoading" class="flex w-full aspect-square p-16">
      <span class="spinner w-8 h-8 m-auto" />
    </div>

    <!-- Error -->
    <p v-if="isError">{{ errorMessage }}</p>

    <!-- Timestamps -->
    <table
      v-else
      class="w-full"
      :class="{ 'opacity-50 pointer-events-none': disabled }"
    >
      <timestamp-list-item
        v-for="timestamp of timestamps"
        :key="timestamp.id"
        :timestamp="timestamp"
      />

      <p
        v-if="!timestamps.length"
        class="p-4 text-center w-full text-sm opacity-50"
      >
        No timestmaps
      </p>

      <button class="btn gap-2 w-full">
        <icon-plus />
        <span>Add Timestamp</span>
      </button>
    </table>
  </div>
</template>
