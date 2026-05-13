<script lang="ts" setup>
import IconMdiAlertDecagram from '~icons/mdi/alert-circle';
import IconMdiChevronRight from '~icons/mdi/chevron-right';

import EditEpisodeForm from './EditEpisodeForm.vue';
import SidePanelLayout from './SidePanelLayout.vue';
import TimestampList from './TimestampList.vue';

const { state: auth } = useAuth();

const { view } = useView();
/** Open the login form, then switch back to this view. */
const loginAndReturn = useViewOperation('account', () => {
  view.value = 'timestamps';
});

const { isEditing } = useIsEditing();
const discardChanges = useDiscardChanges();
const { mutate: saveChanges, isLoading } = useSaveChangesMutation();

const episodeUrl = useApiEpisodeUrl();
const timestamps = useCurrentTimestamps();

const { data: currentTemplate, isFetched: isCurrentTemplateFetched } =
  useCurrentTemplateQuery();

const isTemplateButtonsVisible = computed(
  () =>
    (timestamps.value.length > 0 || currentTemplate.value) &&
    !!episodeUrl.value &&
    !!auth.value,
);

const isLoginWarningVisible = computed(() => isEditing.value && !auth.value);
</script>

<template>
  <side-panel-layout class="w-72 lg:w-80" @form-submit="saveChanges">
    <template #title>Edit Episode</template>

    <!-- Timestamps -->
    <template #content>
      <edit-episode-form />
      <timestamp-list />
    </template>

    <!-- Login Warning -->
    <template #bottom-content v-if="isLoginWarningVisible">
      <div
        class="flex cursor-pointer items-center gap-4 bg-warning p-4 text-warning-content transition-all hover:saturate-150"
        @click="loginAndReturn"
      >
        <div class="flex flex-1 flex-col gap-2">
          <h4 class="flex items-center gap-2 text-lg font-bold">
            <icon-mdi-alert-decagram class="h-6 w-6" />
            <span>Log In</span>
          </h4>
          <p class="text-sm">
            To save timestamps, create an account or log into Anime Skip
          </p>
        </div>

        <icon-mdi-chevron-right />
      </div>
    </template>

    <template #buttons v-if="isEditing">
      <!-- Save -->
      <button
        type="submit"
        class="grow-1 btn btn-primary"
        :class="{ loading: isLoading }"
        :disabled="isLoading || !auth"
      >
        Save Changes
      </button>

      <!-- Discard -->
      <button
        class="btn flex-1 hover:btn-error"
        type="button"
        @click="discardChanges"
        :disabled="isLoading"
      >
        Discard
      </button>
    </template>

    <template #buttons v-else-if="isTemplateButtonsVisible">
      <!-- Create Template -->
      <button class="btn flex-1" type="button" @click="view = 'edit-template'">
        {{ currentTemplate ? 'Edit' : 'Create' }} Template
      </button>
    </template>
  </side-panel-layout>
</template>
