<script lang="ts" setup>
import { Scalars } from '../utils/api';
import { formatTimestampInS } from '../utils/time-utils';
import {
  AmbiguousTimestamp,
  UNKNOWN_TIMESTAMP_TYPE_ID,
} from '../utils/timestamp-utils';
import IconMdiClock from '~icons/mdi/clock';
import IconFilter from '~icons/anime-skip/filter';
import IconMdiRadioBlank from '~icons/mdi/radiobox-blank';
import IconMdiRadioMarked from '~icons/mdi/radiobox-marked';

// interface EpisodeDetails {
//     show:
//       | { type: 'new'; name: string }
//       | { type: 'existing'; id: Scalars['ID'] };
//     episode:
//       | { type: 'new'; name: string }
//       | { type: 'existing'; id: Scalars['ID'] };
//     season: string;
//     number: string;
//   };
// }

const props = defineProps<{
  timestamp: AmbiguousTimestamp;
}>();

const emits = defineEmits<{
  (event: 'update:timestamp', newTimestamp: AmbiguousTimestamp): void;
}>();

const timestamp = useVModel(props, 'timestamp', emits);
const at = computed(() => formatTimestampInS(timestamp.value.at, true));

const atBtn = ref<HTMLButtonElement>();
function focusOnAt() {
  atBtn.value?.focus();
}
onMounted(focusOnAt);

const typeId = computed<Scalars['ID']>({
  get() {
    return timestamp.value.typeId;
  },
  set(typeId) {
    timestamp.value = { ...toRaw(timestamp.value), typeId };
  },
});

const { data: types, isLoading, error, isError } = useAllTimestampTypesQuery();
const errorMessage = useErrorMessage(error);

const typeSearch = ref('');
const typeSearchResults = useFuzzySearch(typeSearch, types, (t) => t.name);

// Reset the selected type on change
watch(typeSearchResults, (newResults) => {
  typeId.value = newResults[0]?.id ?? UNKNOWN_TIMESTAMP_TYPE_ID;
});

function onKeyDown(event: KeyboardEvent) {
  const increments: Record<string, number> = {
    ArrowUp: -1,
    ArrowDown: 1,
  };
  const increment = increments[event.key];
  if (!increment) return;

  const index = typeSearchResults.value.findIndex((t) => t.id === typeId.value);
  let newIndex = index + increment;
  if (newIndex < 0) newIndex += typeSearchResults.value.length;
  if (newIndex >= typeSearchResults.value.length)
    newIndex = newIndex % typeSearchResults.value.length;

  typeId.value = typeSearchResults.value[newIndex].id;
}
</script>

<template>
  <div class="flex flex-col gap-4 p-4">
    <!-- At -->
    <button
      ref="atBtn"
      class="btn btn-lg gap-4 focus:btn-primary"
      @click.prevent.stop="focusOnAt"
    >
      <icon-mdi-clock class="w-6 h-6" />
      <span class="flex-1 text-left">{{ at }}</span>
    </button>

    <div class="flex flex-col gap-4" @keydown.stop="onKeyDown">
      <!-- Search types input -->
      <div class="form-control w-full">
        <label class="label">
          <span class="label-text">Timestamp Type</span>
        </label>
        <label class="input-group">
          <span><icon-filter class="w-6 h-6" /></span>
          <input
            class="input input-bordered focus:input-primary w-full"
            v-model="typeSearch"
            placeholder="Filter..."
          />
        </label>
      </div>

      <!-- List of types -->
      <ul class="menu menu-compact gap-1">
        <li
          v-for="t of typeSearchResults"
          :key="t.id"
          :title="t.description"
          @click.prevent.stop="typeId = t.id"
        >
          <button class="rounded px-2" :class="{ active: typeId === t.id }">
            <icon-mdi-radio-marked v-if="typeId === t.id" class="w-5 h-5" />
            <icon-mdi-radio-blank
              v-else
              class="w-5 h-5 text-base-content text-opacity-50"
            />
            <span>{{ t.name }}</span>
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>
