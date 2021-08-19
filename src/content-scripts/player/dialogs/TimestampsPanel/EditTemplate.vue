<template>
  <LoadingOverlay class="h-full" :is-loading="isSavingTemplate">
    <TimestampPanelLayout mode="back" title="Template" @back="discardChanges">
      <template #content>
        <div class="px-4 pt-2 pb-3 space-y-2">
          <p class="body-2 text-on-surface text-opacity-medium">
            Setup default timestamps for episodes
          </p>
          <ul>
            <li class="flex flex-row items-center space-x-4 py-2" @click="changeType('SHOW')">
              <Icon
                :path="getShowRadioIcon(isShowSelected)"
                :class="getShowRadioIconClass(isShowSelected)"
              />
              <p class="text-on-surface" :class="getShowLabelClass(isShowSelected)">All Episodes</p>
            </li>
            <li class="flex flex-row items-center space-x-4 py-2" @click="changeType('SEASONS')">
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

<script lang="ts">
import useRadioIcon from '~/common/composition/useRadioIcon';
import { MutationTypes } from '~/common/store/mutationTypes';
import { computed, defineComponent, ref } from 'vue';
import { useStore } from 'vuex';
import Utils from '~/common/utils/Utils';
import { SECONDS, TIMESTAMP_TYPES } from '~/common/utils/Constants';
import { ActionTypes } from '~/common/store/actionTypes';
import RequestState from '~/common/utils/RequestState';
import { GetterTypes } from '~/common/store/getterTypes';

export default defineComponent({
  setup() {
    const store = useStore();
    const existingTemplate = computed(() => store.getters[GetterTypes.EDITABLE_TEMPLATE]);
    const onClickDelete = () => {
      const template = existingTemplate.value;
      if (template == null) {
        console.warn(
          "Cannot delete a template that doesn't exist",
          JSON.stringify(template, null, 2)
        );
        return;
      }
      store
        .dispatch(ActionTypes.DELETE_TEMPLATE, { templateId: template.id })
        .then(() => store.commit(MutationTypes.TOGGLE_EDIT_TEMPLATE, false));
    };
    const discardChanges = () => {
      store.commit(MutationTypes.TOGGLE_EDIT_TEMPLATE, false);
    };
    const isSavingTemplate = computed(
      () => store.state.templateRequestState === RequestState.LOADING
    );

    const type = ref<Api.TemplateType>(existingTemplate.value?.type ?? 'SHOW');
    const changeType = (newType: Api.TemplateType) => {
      type.value = newType;
    };
    const isShowSelected = computed(() => type.value === 'SHOW');
    const {
      getRadioIcon: getShowRadioIcon,
      getRadioIconClass: getShowRadioIconClass,
      getLabelClass: getShowLabelClass,
    } = useRadioIcon();
    const isSeasonSelected = computed(() => type.value === 'SEASONS');
    const {
      getRadioIcon: getSeasonRadioIcon,
      getRadioIconClass: getSeasonRadioIconClass,
      getLabelClass: getSeasonLabelClass,
    } = useRadioIcon();
    const season = ref<string>(
      existingTemplate.value?.seasons?.[0] ?? store.getters.DISPLAY_EPISODE_INFO.season ?? ''
    );
    const seasonsToSave = computed<string[] | undefined>(() =>
      type.value === 'SEASONS' ? [season.value] : undefined
    );
    const isSeasonValid = computed(() => !isSeasonSelected.value || !!season.value.trim());
    const seasonErrorMessage = computed(() =>
      isSeasonValid.value ? undefined : 'A season is required'
    );

    const timestamps = computed(() => store.getters.TIMESTAMPS as Api.Timestamp[]);
    const selectedTimestamps = ref(
      existingTemplate.value?.timestampIds.reduce((map, id) => {
        map[id] = true;
        return map;
      }, {} as Record<string, boolean>) ?? {}
    );
    const toggleTimestamp = (id: string) => {
      selectedTimestamps.value = {
        ...selectedTimestamps.value,
        [id]: !selectedTimestamps.value?.[id],
      };
    };
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
      return typeMap[timestamp.typeId].name;
    };

    const hoverTimeout = ref<number | undefined>(undefined);
    const setHoveredTimestamp = (timestamp: Api.AmbiguousTimestamp) => {
      store.commit(MutationTypes.SET_HOVERED_TIMESTAMP, timestamp);
    };
    const clearHoveredTimestamp = () => {
      store.commit(MutationTypes.CLEAR_HOVERED_TIMESTAMP);
    };
    const onHoverTimestamp = (timestamp: Api.AmbiguousTimestamp): void => {
      if (hoverTimeout.value != null) window.clearTimeout(hoverTimeout.value);
      setHoveredTimestamp(timestamp);
      hoverTimeout.value = window.setTimeout(clearHoveredTimestamp, 3 * SECONDS);
    };
    const onStopHoverTimestamp = (): void => {
      if (hoverTimeout.value != null) window.clearTimeout(hoverTimeout.value);
      clearHoveredTimestamp();
    };

    const isDeleteDisabled = computed(() => existingTemplate.value == null);
    const isCreateNew = computed(() => isDeleteDisabled.value);
    const saveButtonLabel = computed(() => (isCreateNew.value ? 'Create' : 'Save'));
    const onClickSave = () => {
      const newTimestampIds = Object.entries(selectedTimestamps.value)
        .filter(([_, selected]) => selected)
        .map(([id, _]) => id);
      if (isCreateNew.value) {
        store
          .dispatch(ActionTypes.CREATE_TEMPLATE, {
            type: type.value,
            selectedTimestampIds: newTimestampIds,
            seasons: seasonsToSave.value,
          })
          .then(() => store.commit(MutationTypes.TOGGLE_EDIT_TEMPLATE, false));
      } else {
        if (existingTemplate.value == null) {
          console.warn('Cannot update an undefined template');
          return;
        }
        store
          .dispatch(ActionTypes.UPDATE_TEMPLATE, {
            templateId: existingTemplate.value.id,
            type: type.value,
            selectedTimestampIds: newTimestampIds,
            seasons: seasonsToSave.value,
          })
          .then(() => store.commit(MutationTypes.TOGGLE_EDIT_TEMPLATE, false));
      }
    };
    const hasSelectedTimestamps = computed<boolean>(
      () => Object.entries(selectedTimestamps.value).filter(([_, selected]) => selected).length > 0
    );
    const isSaveDisabled = computed<boolean>(
      () => !hasSelectedTimestamps.value || !isSeasonValid.value
    );

    return {
      isDeleteDisabled,
      saveButtonLabel,
      discardChanges,
      onClickSave,
      isSavingTemplate,
      onClickDelete,
      changeType,
      isShowSelected,
      getShowRadioIcon,
      getShowRadioIconClass,
      getShowLabelClass,
      isSeasonSelected,
      getSeasonRadioIcon,
      getSeasonRadioIconClass,
      getSeasonLabelClass,
      season,
      isSeasonValid,
      seasonErrorMessage,
      timestamps,
      selectedTimestamps,
      toggleTimestamp,
      time,
      timestampType,
      onHoverTimestamp,
      onStopHoverTimestamp,
      isSaveDisabled,
    };
  },
});
</script>
