<script lang="ts" setup>
import TimestampListItem from './TimestampListItem.vue';
import IconPlus from '~icons/anime-skip/plus';

const timestamps = useCurrentTimestamps();
const { isLoading, isError, error } = useFindEpisodeUrlQuery();
const errorMessage = useErrorMessage(error);

const createTimestamp = useCreateTimestamp();
</script>

<template>
  <div class="p-2">
    <!-- Loading -->
    <div v-if="isLoading" class="flex w-full aspect-square p-16">
      <span class="spinner w-8 h-8 m-auto" />
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
        class="p-4 text-center w-full text-sm opacity-50"
      >
        No timestmaps
      </p>

      <!-- Add button -->
      <button class="btn gap-2 w-full mt-2" @click="createTimestamp">
        <icon-plus />
        <span>Add Timestamp</span>
      </button>
    </template>
  </div>
</template>
