<script lang="ts" setup>
import SidePanelLayout from './SidePanelLayout.vue';
import LoginForm from './LoginForm.vue';
import TimestampList from './TimestampList.vue';

const { value: auth } = useAuth();
</script>

<template>
  <side-panel-layout class="w-72 lg:w-80">
    <template #title>Timestamps</template>

    <template #content>
      <login-form
        class="p-4 gap-4 border-b border-base-content border-opacity-10"
        v-if="!auth"
      />
      <timestamp-list :class="{ 'opacity-50 pointer-events-none': !auth }" />
    </template>

    <template v-if="auth" #buttons>
      <button class="flex-1 btn btn-primary">Save</button>
      <button class="flex-1 btn btn-outline hover:btn-error">Discard</button>
    </template>
  </side-panel-layout>
</template>
