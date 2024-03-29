<script lang="ts" setup>
import IconAccount from '~icons/anime-skip/account';
import IconPassword from '~icons/anime-skip/password';
import IconMdiOpenInNew from '~icons/mdi/open-in-new';
import md5 from 'md5';

const emits = defineEmits<{
  (event: 'loggedIn'): void;
}>();

const { state: auth } = useAuth();

const username = ref('');
const password = ref('');

const { mutate, isLoading, isError, error } = useLoginMutation();
const gqlError = useErrorMessage(error);

function login() {
  const usernameEmail = username.value.trim();
  const passwordPrehash = password.value.trim();
  username.value = usernameEmail;
  password.value = passwordPrehash;

  if (!usernameEmail) {
    validationError.value = 'You must enter a username or email.';
    return;
  } else if (!passwordPrehash) {
    validationError.value = 'You must enter a password.';
    return;
  }

  validationError.value = undefined;
  mutate(
    { passwordHash: md5(passwordPrehash), usernameEmail },
    {
      onSuccess(data) {
        auth.value = {
          refreshToken: data.login.refreshToken,
          token: data.login.authToken,
          account: data.login.account,
        };
        emits('loggedIn');
      },
    },
  );
}

const validationError = ref<string>();
</script>

<template>
  <form class="flex flex-col gap-4" @submit.prevent="login">
    <!-- Header -->
    <div>
      <h3 class="text-base-content font-bold text-opacity-90 text-lg">
        Log in to Anime Skip
      </h3>
    </div>

    <!-- Username -->
    <div class="form-control">
      <label class="input-group">
        <span>
          <icon-account />
        </span>
        <input
          class="w-full input input-bordered focus:input-primary"
          type="text"
          autocomplete="username"
          placeholder="Username or email"
          v-model="username"
          @keydown.stop
        />
      </label>
    </div>

    <!-- Password -->
    <div class="form-control">
      <label class="input-group">
        <span>
          <icon-password />
        </span>
        <input
          class="w-full input input-bordered focus:input-primary"
          type="password"
          autocomplete="current-password"
          placeholder="Password"
          v-model="password"
          @keydown.stop
        />
      </label>
    </div>

    <p v-if="isError" class="text-error text-sm text-center">{{ gqlError }}</p>

    <!-- Buttons -->
    <div class="flex gap-4 flex-row-reverse">
      <button
        class="flex-1 btn btn-primary"
        :class="{ loading: isLoading }"
        :disabled="isLoading"
        type="submit"
      >
        Login
      </button>
      <a
        class="flex-1 btn btn-ghost gap-2"
        href="https://anime-skip.com/sign-up"
        target="_blank"
        >Sign Up<icon-mdi-open-in-new class="w-5 h-5" />
      </a>
    </div>
  </form>
</template>
