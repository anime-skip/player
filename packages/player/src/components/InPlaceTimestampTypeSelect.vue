<script lang="ts" setup>
import { TimestampFragment } from '../utils/api';
import IconChevronDown from '~icons/anime-skip/chevron-down';

const props = defineProps<{
  timestamp: TimestampFragment;
}>();

const {
  data: types,
  isLoading: isTypesLoading,
  isError: isTypesError,
  error: typesError,
} = useAllTimestampTypesQuery();
const typesErrorMessage = useErrorMessage(typesError);

const timestampTypesMap = useTimestampTypeMap();
const type = computed(() => timestampTypesMap.value?.[props.timestamp.typeId]);
</script>

<template>
  <div class="relative">
    <select
      class="appearance-none bg-transparent text-base mr-2 cursor-pointer"
      :value="type?.id"
      :disabled="true || isTypesLoading"
    >
      <!-- Error Message -->
      <option v-if="isTypesError" disabled>{{ typesErrorMessage }}</option>

      <!-- Types List -->
      <template v-else>
        <option disabled>Select a type:</option>
        <option v-for="t of types" :key="t.id" :value="t.id">
          {{ t.name }}
        </option>
      </template>
    </select>

    <!-- Chevron placement -->
    <p class="absolute left-0 top-0 pointer-events-none">
      <span class="text-base opacity-0">{{ type?.name }}</span>
      <icon-chevron-down class="inline opacity-50" />
    </p>
  </div>
</template>
