<script lang="ts" setup>
import md5 from 'md5';
import IconAccount from '~icons/anime-skip/account';
import IconPassword from '~icons/anime-skip/password';
import IconMdiOpenInNew from '~icons/mdi/open-in-new';

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
  const passwordPreHash = password.value.trim();
  username.value = usernameEmail;
  password.value = passwordPreHash;

  if (!usernameEmail) {
    validationError.value = 'You must enter a username or email.';
    return;
  } else if (!passwordPreHash) {
    validationError.value = 'You must enter a password.';
    return;
  }

  validationError.value = undefined;
  mutate(
    { passwordHash: md5(passwordPreHash), usernameEmail },
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
      <h3 class="text-lg font-bold text-base-content text-opacity-90">
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
          class="input input-bordered w-full focus:input-primary"
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
          class="input input-bordered w-full focus:input-primary"
          type="password"
          autocomplete="current-password"
          placeholder="Password"
          v-model="password"
          @keydown.stop
        />
      </label>
    </div>

    <p v-if="isError" class="text-center text-sm text-error">{{ gqlError }}</p>

    <!-- Buttons -->
    <div class="flex flex-row-reverse gap-4">
      <button
        class="btn btn-primary flex-1"
        :class="{ loading: isLoading }"
        :disabled="isLoading"
        type="submit"
      >
        Login
      </button>
      <a
        class="btn btn-ghost flex-1 gap-2"
        href="https://anime-skip.com/sign-up"
        target="_blank"
        >Sign Up<icon-mdi-open-in-new class="h-5 w-5" />
      </a>
    </div>
  </form>
</template>
