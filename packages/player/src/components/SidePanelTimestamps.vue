<script lang="ts" setup>
import useViewOperation from '../composables/useViewOperation';
import SidePanelLayout from './SidePanelLayout.vue';
import TimestampList from './TimestampList.vue';
import IconMdiChevronRight from '~icons/mdi/chevron-right';
import IconMdiAlertDecagram from '~icons/mdi/alert-circle';

const { state: auth } = useAuth();

const view = useView();
/**
 * Open the login form, then switch back to this view.
 */
const loginAndReturn = useViewOperation('account', () => {
  view.value = 'timestamps';
});
</script>

<template>
  <side-panel-layout class="w-72 lg:w-80">
    <template #title>Timestamps</template>

    <template #content>
      <!-- Login Warning -->
      <div
        v-if="!auth"
        class="bg-warning cursor-pointer hover:saturate-150 text-warning-content p-4 flex gap-4 items-center transition-all"
        @click="loginAndReturn"
      >
        <div class="flex-1 flex flex-col gap-2">
          <h4 class="font-bold text-lg flex gap-2 items-center">
            <icon-mdi-alert-decagram class="w-6 h-6" />
            <span>Log In</span>
          </h4>
          <p class="text-sm">
            To edit timestamps, create an account or log into Anime Skip
          </p>
        </div>

        <icon-mdi-chevron-right />
      </div>

      <!-- Timestamps -->
      <timestamp-list :disabled="!auth" />
    </template>

    <template v-if="auth" #buttons>
      <button class="flex-1 btn btn-primary">Save</button>
      <button class="flex-1 btn btn-outline hover:btn-error">Discard</button>
    </template>
  </side-panel-layout>
</template>
