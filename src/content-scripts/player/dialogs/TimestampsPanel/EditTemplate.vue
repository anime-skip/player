<template>
  <LoadingOverlay class="h-full" :is-loading="isSavingTemplate">
    <TimestampPanelLayout mode="back" title="Template" @back="discardChanges">
      <template #content>
        <div class="px-4 pt-2 pb-3 space-y-2">
          <p class="body-2 text-on-surface text-opacity-medium">
            Setup default timestamps for episodes
          </p>
          <ul>
            <li
              class="flex flex-row items-center space-x-4 py-2"
              @click="changeType(TemplateType.SHOW)"
            >
              <Icon
                :path="getShowRadioIcon(isShowSelected)"
                :class="getShowRadioIconClass(isShowSelected)"
              />
              <p class="text-on-surface" :class="getShowLabelClass(isShowSelected)">All Episodes</p>
            </li>
            <li
              class="flex flex-row items-center space-x-4 py-2"
              @click="changeType(TemplateType.SEASONS)"
            >
              <Icon
                :path="getShowRadioIcon(isSeasonSelected)"
                :class="getShowRadioIconClass(isSeasonSelected)"
              />
              <p class="text-on-surface" :class="getShowLabelClass(isSeasonSelected)">
                Specific Season
              </p>
            </li>
            <text-input
              v-if="isSeasonSelected"
              v-model:value="season"
              placeholder="Enter a season..."
              class="ml-12 mb-4"
              :is-valid="isSeasonValid"
              :error-message="seasonErrorMessage"
            />
          </ul>
          <p class="subtitle-1">Select Timestamps</p>
          <ul>
            <li
              v-for="timestamp in timestamps"
              :key="timestamp.id"
              @mouseenter="onHoverTimestamp(timestamp)"
              @mouseleave.stop.prevent="onStopHoverTimestamp()"
            >
              <Checkbox v-model:checked="selectedTimestamps[timestamp.id]">
                <p
                  :class="{
                    'opacity-medium': !selectedTimestamps[timestamp.id],
                  }"
                >
                  <span class="body-1 text-primary font-bold">{{ time(timestamp) }}</span>
                  &ensp;
                  <span class="body-1 text-on-surface">{{ timestampType(timestamp) }}</span>
                </p>
              </Checkbox>
            </li>
          </ul>
        </div>
      </template>
      <template #footer>
        <raised-button class="flex-grow" :disabled="isSaveDisabled" @click="onClickSave">
          {{ saveButtonLabel }}
        </raised-button>
        <raised-button class="flex-grow" error :disabled="isDeleteDisabled" @click="onClickDelete">
          Delete
        </raised-button>
      </template>
    </TimestampPanelLayout>
  </LoadingOverlay>
</template>

<script lang="ts" setup>
import { useTimeout } from '@anime-skip/ui';
import { computed, ref } from 'vue';
import { RequestState } from 'vue-use-request-state';
import useRadioIcon from '~/common/composition/useRadioIcon';
import { SECONDS, TIMESTAMP_TYPES } from '~/common/utils/Constants';
import Utils from '~/common/utils/Utils';
import * as Api from '~api';
import { TemplateType } from '~api';
import { useDeleteTemplate } from '../../hooks/useDeleteTemplate';
import { useDisplayedTimestamps } from '../../hooks/useDisplayedTimestamps';
import { useEpisodeDisplayInfo } from '../../hooks/useEpisodeDisplayInfo';
import { useMatchingTemplate } from '../../hooks/useMatchingTemplate';
import { useSaveNewTemplate } from '../../hooks/useSaveNewTemplate';
import { useSaveTemplate } from '../../hooks/useSaveTemplate';
import {
  useClearHoveredTimestamp,
  useUpdateHoveredTimestamp,
} from '../../state/useHoveredTimestamp';
import { useTemplateRequestState, useTemplateTimestamps } from '../../state/useTemplateState';
import { useUpdateIsEditingTemplate } from './useTimestampPanelState';

const deleteTemplate = useDeleteTemplate();
const updateIsEditingTemplate = useUpdateIsEditingTemplate();
const templateRequestState = useTemplateRequestState();

const template = useMatchingTemplate();
const templateTimestamps = useTemplateTimestamps();

const onClickDelete = () => {
  if (template.value == null) {
    console.warn(
      "Cannot delete a template that doesn't exist",
      JSON.stringify(template.value, null, 2)
    );
    return;
  }
  void deleteTemplate(template.value.id)
    .then()
    .then(() => updateIsEditingTemplate(false));
};
const discardChanges = () => {
  updateIsEditingTemplate(false);
};
const isSavingTemplate = computed(() => templateRequestState.value === RequestState.LOADING);

const type = ref<Api.TemplateType>(template.value?.type ?? TemplateType.SHOW);
const changeType = (newType: Api.TemplateType) => {
  type.value = newType;
};
const isShowSelected = computed(() => type.value === TemplateType.SHOW);
const {
  getRadioIcon: getShowRadioIcon,
  getRadioIconClass: getShowRadioIconClass,
  getLabelClass: getShowLabelClass,
} = useRadioIcon();
const isSeasonSelected = computed(() => type.value === TemplateType.SEASONS);
const episodeDisplayInfo = useEpisodeDisplayInfo();
const season = ref<string>(template.value?.seasons?.[0] ?? episodeDisplayInfo.value.season ?? '');
const seasonsToSave = computed<string[] | undefined>(() =>
  type.value === TemplateType.SEASONS ? [season.value] : undefined
);
const isSeasonValid = computed(() => !isSeasonSelected.value || !!season.value.trim());
const seasonErrorMessage = computed(() =>
  isSeasonValid.value ? undefined : 'A season is required'
);

const timestamps = useDisplayedTimestamps();
const selectedTimestamps = ref(
  templateTimestamps.value?.reduce((map, timestamp) => {
    map[timestamp.id] = true;
    return map;
  }, {} as Record<string, boolean>) ?? {}
);
const typeMap = TIMESTAMP_TYPES.reduce<{ [typeId: string]: Api.TimestampType }>(
  (map, timestamp) => {
    map[timestamp.id] = timestamp;
    return map;
  },
  {}
);
const time = (timestamp: Api.AmbiguousTimestamp): string => {
  return Utils.formatSeconds(timestamp.at, false);
};
const timestampType = (timestamp: Api.AmbiguousTimestamp): string => {
  return typeMap[timestamp.typeId]?.name ?? 'Unknown';
};

// Hovered Timestamps

const [setHoveredTimeout, clearHoveredTimeout] = useTimeout();
const setHoveredTimestamp = useUpdateHoveredTimestamp();
const clearHoveredTimestamp = useClearHoveredTimestamp();
const onHoverTimestamp = (timestamp: Api.AmbiguousTimestamp): void => {
  clearHoveredTimeout();
  setHoveredTimestamp(timestamp);
  setHoveredTimeout(clearHoveredTimestamp, 3 * SECONDS);
};
const onStopHoverTimestamp = (): void => {
  clearHoveredTimeout();
  clearHoveredTimestamp();
};

// Saving

const saveNewTemplate = useSaveNewTemplate();
const saveTemplate = useSaveTemplate();

const isDeleteDisabled = computed(() => template.value == null);

const isCreateNew = computed(() => isDeleteDisabled.value);

const saveButtonLabel = computed(() => (isCreateNew.value ? 'Create' : 'Save'));

const onClickSave = () => {
  const newTimestampIds = Object.entries(selectedTimestamps.value)
    .filter(([_, selected]) => selected)
    .map(([id, _]) => id);
  let savePromise: Promise<void>;
  if (isCreateNew.value) {
    savePromise = saveNewTemplate(type.value, seasonsToSave.value, newTimestampIds);
  } else {
    if (template.value == null) {
      console.warn('Cannot update an undefined template');
      return;
    }
    savePromise = saveTemplate(template.value.id, type.value, seasonsToSave.value, newTimestampIds);
  }
  savePromise.then(() => updateIsEditingTemplate(false));
};

const hasSelectedTimestamps = computed<boolean>(
  () => Object.entries(selectedTimestamps.value).filter(([_, selected]) => selected).length > 0
);

const isSaveDisabled = computed<boolean>(
  () => !hasSelectedTimestamps.value || !isSeasonValid.value
);
</script>
