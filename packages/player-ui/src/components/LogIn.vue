<template>
  <LoadingOverlay :is-loading="isLoading">
    <form class="as-w-popup-sm as-p-6 as-flex as-flex-col as-space-y-4" @submit.prevent.stop>
      <LabeledHeader title="Log In" />
      <TextInput
        ref="usernameInput"
        placeholder="Username"
        autocomplete="username"
        v-model:value="username"
        @submit="login"
      >
        <template #left-icon>
          <i-mdi-account class="as-w-6 as-h-6 as-opacity-medium" />
        </template>
      </TextInput>
      <TextInput
        placeholder="Password"
        :error-message="isError ? 'Username or password is incorrect' : undefined"
        autocomplete="current-password"
        type="password"
        v-model:value="password"
        @submit="login"
      >
        <template #left-icon>
          <i-mdi-key class="as-w-6 as-h-6 as-opacity-medium" />
        </template>
      </TextInput>
      <div class="as-flex as-flex-row-reverse as-justify-between as-items-center">
        <RaisedButton @click="login">Log In</RaisedButton>
        <a
          href="https://www.anime-skip.com/sign-up"
          target="_blank"
          class="as-space-x-2 as-body-1 as-text-on-surface"
        >
          Sign Up
          <i-mdi-open-in-new class="as-w-4 as-h-4 as-inline as-opacity-medium" />
        </a>
      </div>
    </form>
  </LoadingOverlay>
</template>

<script lang="ts" setup>
import { TextInputRef } from 'common/src/types';
import { useLoginMutation } from '../composables/useLoginMutation';
import { useAuthStore } from '../stores/useAuthStore';
import { useDialogStore } from '../stores/useDialogStore';

const emit = defineEmits<{
  (event: 'logged-in'): void;
}>();

const auth = useAuthStore();

// Login

const username = ref('');
const password = ref('');

const { isError, mutate: _login, isLoading } = useLoginMutation();

function login() {
  _login(
    { username: username.value, password: password.value },
    {
      async onSuccess(data) {
        username.value = '';
        password.value = '';
        await auth.setTokens({
          accessToken: data.authToken,
          refreshToken: data.refreshToken,
        });
        emit('logged-in');
      },
    }
  );
}

// Input Ref Focus

const usernameInput = ref<TextInputRef>();
onMounted(() => {
  usernameInput.value?.focus();
});
</script>
