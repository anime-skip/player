<script lang="ts" setup>
import IconPlus from '~icons/anime-skip/plus';

import TimestampListItem from './TimestampListItem.vue';

const timestamps = useCurrentTimestamps();
const { isLoading, isError, error } = useFindEpisodeUrlQuery();
const errorMessage = useErrorMessage(error);

const createTimestamp = useCreateTimestamp();
</script>

<template>
  <div class="p-2">
    <!-- Loading -->
    <div v-if="isLoading" class="flex aspect-square w-full p-16">
      <span class="spinner m-auto h-8 w-8" />
    </div>

    <!-- Error -->
    <p v-else-if="isError">{{ errorMessage }}</p>

    <template v-else>
      <!-- Timestamps -->
      <table class="w-full">
        <timestamp-list-item
          v-for="timestamp of timestamps"
          :key="timestamp.id"
          :timestamp="timestamp"
        />
      </table>

      <!-- Empty -->
      <p
        v-if="!timestamps.length"
        class="w-full p-4 text-center text-sm opacity-50"
      >
        No timestamps
      </p>

      <!-- Add button -->
      <button class="btn mt-2 w-full gap-2" @click="createTimestamp">
        <icon-plus />
        <span>Add Timestamp</span>
      </button>
    </template>
  </div>
</template>
