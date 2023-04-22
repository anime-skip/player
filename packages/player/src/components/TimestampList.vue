<script lang="ts" setup>
import TimestampListItem from './TimestampListItem.vue';

const timestamps = useCurrentTimestamps();
const { isLoading, isError, error } = useFindEpisodeUrlQuery();
const errorMessage = useErrorMessage(error);
</script>

<template>
  <div class="p-2">
    <!-- Loading -->
    <div v-if="isLoading" class="flex h-full w-full p-16">
      <span class="spinner w-8 h-8 m-auto" />
    </div>

    <!-- Error -->
    <p v-if="isError">{{ errorMessage }}</p>

    <!-- Timestamps -->
    <table v-else class="w-full">
      <timestamp-list-item
        v-for="timestamp of timestamps"
        :key="timestamp.id"
        :timestamp="timestamp"
      />
    </table>
  </div>
</template>
