<script lang="ts" setup>
import useApiShowId from '../composables/useApiShowId';
import useFindEpisodeQuery from '../composables/useFindEpisodeQuery';
import {
  TemplateFragment,
  TemplateType,
  TimestampFragment,
} from '../utils/api';
import SidePanelLayout from './SidePanelLayout.vue';
import TemplateTimestampListItem from './TemplateTimestampListItem.vue';

const DEFAULT_TEMPLATE_TYPE = TemplateType.Show;

const templateType = ref(DEFAULT_TEMPLATE_TYPE);
const seasonsArray = ref<string[]>([]);
const season = computed({
  get() {
    return seasonsArray.value?.[0];
  },
  set(newValue: string | undefined) {
    if (newValue) {
      seasonsArray.value = [newValue];
    } else {
      seasonsArray.value = [];
    }
  },
});
const templateTimestamps = ref<TimestampFragment[]>([]);

const apiEpisode = useApiEpisode();
watch(templateType, (templateType) => {
  if (templateType === TemplateType.Seasons && !season.value) {
    season.value = apiEpisode.value?.season ?? undefined;
  }
});

function reset(newTemplate: TemplateFragment | undefined) {
  templateType.value = newTemplate?.type ?? DEFAULT_TEMPLATE_TYPE;
  seasonsArray.value = newTemplate?.seasons ? [...newTemplate.seasons] : [];
  templateTimestamps.value = newTemplate ? [...newTemplate.timestamps] : [];
}

const { data: template } = useCurrentTemplateQuery();
watch(template, reset);
onMounted(() => reset(template.value));

const hasChanges = computed(() => {
  if (template.value?.type !== templateType.value) return true;
  if (
    templateType.value === TemplateType.Seasons &&
    template.value.seasons?.join(',') !== seasonsArray.value.join(',')
  )
    return true;

  const oldTimestamps = template.value.timestamps
    .map((t) => t.id)
    .sort()
    .join();
  const newTimestamps = templateTimestamps.value
    .map((t) => t.id)
    .sort()
    .join();

  return oldTimestamps !== newTimestamps;
});

const isSourceEpisode = computed<boolean>(
  () =>
    !template.value || episode.value?.id === template.value?.sourceEpisodeId,
);

const apiTimestamps = useApiTimestamps();
const { data: sourceEpisode, error: sourceEpisodeError } = useFindEpisodeQuery(
  () => template.value?.sourceEpisodeId,
);
const possibleTimestamps = computed(() => {
  if (isSourceEpisode.value) return apiTimestamps.value;
  return sourceEpisode.value?.timestamps;
});

function isTimestampInTemplate(timestamp: TimestampFragment) {
  return !!templateTimestamps.value.find((t) => t.id === timestamp.id);
}

function toggleTimestamp(timestamp: TimestampFragment, isChecked: boolean) {
  const newTimestamps = [...toRaw(templateTimestamps.value)];
  const i = newTimestamps.findIndex((t) => t.id === timestamp.id);
  if (isChecked && i === -1) {
    newTimestamps.push(timestamp);
  } else if (!isChecked && i > -1) {
    newTimestamps.splice(i, 1);
  }
  templateTimestamps.value = newTimestamps;
}

const view = useView();
const { mutate: _deleteTemplate, isLoading: isDeletingTemplate } =
  useDeleteTemplateMutation();
function deleteTemplate() {
  if (!template.value) return;
  _deleteTemplate(
    { id: template.value.id },
    {
      onSuccess: () => view.goBack(),
      onError: (err) => {
        console.error(err);
        window.alert(err);
      },
    },
  );
}

function discardTemplate() {
  reset(template.value);
  view.goBack();
}

const { mutate: _saveTemplate, isLoading: isSaving } =
  useSaveTemplateMutation();

const episode = useApiEpisode();
const episodeId = computed(() => episode.value?.id);
const showId = useApiShowId();
function saveTemplate() {
  if (showId.value == null || episodeId.value == null) return;

  _saveTemplate({
    id: template.value?.id,
    newTemplate: {
      showId: showId.value,
      sourceEpisodeId: episodeId.value,
      type: templateType.value,
      seasons: seasonsArray.value,
    },
    oldTimestamps: toRaw(template.value?.timestamps) ?? [],
    newTimestamps: toRaw(templateTimestamps.value),
  });
}
</script>

<template>
  <side-panel-layout class="w-72 lg:w-80" mode="back">
    <template #title>Template</template>
    <template #content>
      <!-- Template Type -->
      <div class="p-2">
        <p class="text-sm">Apply to</p>
        <div class="p-2">
          <label class="flex gap-4 cursor-pointer p-2 items-center">
            <input
              type="radio"
              class="radio radio-sm checked:bg-primary"
              v-model="templateType"
              :value="TemplateType.Show"
            />
            <span
              class="text-base-content transition"
              :class="{
                'text-opacity-50': templateType !== TemplateType.Show,
              }"
              >Entire Show</span
            >
          </label>
          <label class="flex gap-4 cursor-pointer p-2 items-center">
            <input
              type="radio"
              class="radio radio-sm checked:bg-primary"
              v-model="templateType"
              :value="TemplateType.Seasons"
            />
            <span
              class="text-base-content transition"
              :class="{
                'text-opacity-50': templateType !== TemplateType.Seasons,
              }"
              >Specific Seasons</span
            >
          </label>
        </div>
        <input
          class="input input-sm bg-neutral min-w-0 w-full ml-12 mr-3 translate-x-1 -translate-y-2"
          placeholder="Enter a season..."
          v-model="season"
        />
      </div>

      <!-- Timestamps -->
      <div class="p-2">
        <p class="text-sm">Timestamps</p>

        <ul>
          <template-timestamp-list-item
            v-for="timestamp of possibleTimestamps"
            :key="timestamp.id"
            :timestamp="timestamp"
            :checked="isTimestampInTemplate(timestamp)"
            @toggled="toggleTimestamp"
          />
        </ul>
      </div>
    </template>

    <template #buttons>
      <template v-if="template && !hasChanges">
        <!-- Delete -->
        <button
          class="btn hover:btn-error flex-1"
          :class="{
            loading: isDeletingTemplate,
          }"
          :disabled="isDeletingTemplate"
          @click="deleteTemplate"
        >
          Delete Template
        </button>
      </template>

      <template v-else>
        <!-- Save -->
        <button
          class="btn btn-primary flex-1"
          :class="{
            loading: isSaving,
          }"
          :disabled="isSaving"
          @click="saveTemplate"
        >
          Save
        </button>
        <!-- Discard -->
        <button class="btn flex-1" @click="discardTemplate">Discard</button>
      </template>
    </template>
  </side-panel-layout>
</template>
