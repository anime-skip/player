<template>
  <LoadingOverlay :is-loading="isLoggingIn">
    <form class="as-w-popup-sm as-p-6 as-flex as-flex-col as-space-y-4" @submit.prevent.stop>
      <PopupHeader title="Log In" />
      <TextInput
        ref="usernameInput"
        placeholder="Username"
        autocomplete="username"
        v-model:value="username"
        @submit="login"
      >
        <template #left-icon="slotProps">
          <Icon
            :disabled="slotProps.disabled"
            :active="slotProps.focused"
            path="M12 4C13.0609 4 14.0783 4.42143 14.8284 5.17157C15.5786 5.92172 16 6.93913 16 8C16 9.06087 15.5786 10.0783 14.8284 10.8284C14.0783 11.5786 13.0609 12 12 12C10.9391 12 9.92172 11.5786 9.17157 10.8284C8.42143 10.0783 8 9.06087 8 8C8 6.93913 8.42143 5.92172 9.17157 5.17157C9.92172 4.42143 10.9391 4 12 4V4ZM12 14C16.42 14 20 15.79 20 18V20H4V18C4 15.79 7.58 14 12 14Z"
          />
        </template>
      </TextInput>
      <TextInput
        placeholder="Password"
        :error-message="isLogInError ? 'Username or password is incorrect' : undefined"
        autocomplete="current-password"
        type="password"
        v-model:value="password"
        @submit="login"
      >
        <template #left-icon="slotProps">
          <Icon
            :disabled="slotProps.disabled"
            :active="slotProps.focused"
            path="M7 14C6.46957 14 5.96086 13.7893 5.58579 13.4142C5.21071 13.0391 5 12.5304 5 12C5 11.4696 5.21071 10.9609 5.58579 10.5858C5.96086 10.2107 6.46957 10 7 10C7.53043 10 8.03914 10.2107 8.41421 10.5858C8.78929 10.9609 9 11.4696 9 12C9 12.5304 8.78929 13.0391 8.41421 13.4142C8.03914 13.7893 7.53043 14 7 14ZM12.65 10C11.83 7.67 9.61 6 7 6C5.4087 6 3.88258 6.63214 2.75736 7.75736C1.63214 8.88258 1 10.4087 1 12C1 13.5913 1.63214 15.1174 2.75736 16.2426C3.88258 17.3679 5.4087 18 7 18C9.61 18 11.83 16.33 12.65 14H17V18H21V14H23V10H12.65Z"
          />
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
          <Icon
            class="as-inline"
            size="sm"
            path="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z"
          />
        </a>
      </div>
    </form>
  </LoadingOverlay>
</template>

<script lang="ts" setup>
import useRequestState from 'vue-use-request-state';
import { useLogin } from '../hooks/useLogin';

defineProps<{
  closeAfterLogin?: boolean;
  close?: () => void;
}>();

// Login

const { wrapRequest, isFailure: isLogInError, isLoading: isLoggingIn } = useRequestState();
const username = ref('');
const password = ref('');
const performLogin = useLogin();
const login = wrapRequest(async () => {
  await performLogin(username.value, password.value);
  username.value = '';
  password.value = '';
});

// Input Ref Focus

const usernameInput = ref<TextInputRef>();
onMounted(() => {
  usernameInput.value?.focus();
});
</script>
