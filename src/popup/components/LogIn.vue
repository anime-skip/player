<template>
  <ProgressOverlay :isLoading="isLoggingIn" class="loading">
    <form class="LogIn" ref="form">
      <PopupHeader title="Log In" class="header" :small="small" />
      <TextInput
        class="flex row"
        leftIcon="ic_account.svg"
        placeholder="Username"
        autocomplete="username"
        v-model:value="username"
      />
      <TextInput
        class="flex row"
        leftIcon="ic_password.svg"
        placeholder="Password"
        :errorMessage="isLogInError ? 'Username or password is incorrect' : undefined"
        autocomplete="current-password"
        type="password"
        v-model:value="password"
      />
      <div class="bottom-row flex flex-row-reverse">
        <input type="submit" value="Log In" class="clickable focus button" />
        <a href="https://www.anime-skip.com/sign-up">Sign Up</a>
      </div>
    </form>
  </ProgressOverlay>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
// import TextInput from '@/common/components/TextInput.vue';
import ProgressOverlay from '@/common/components/ProgressOverlay.vue';
import PopupHeader from './PopupHeader.vue';
import { ActionTypes } from '@/common/store/actionTypes';
import { GetterTypes } from '@/common/store/getterTypes';

export default defineComponent({
  components: { ProgressOverlay, PopupHeader },
  props: {
    small: Boolean,
  },
  data() {
    return {
      isError: false,
      username: '',
      password: '',
    };
  },
  mounted() {
    (this.$refs.form as Element).addEventListener('submit', this.onSubmit);
  },
  computed: {
    // TODO: compose and reuse
    isLoggingIn(): boolean {
      return this.$store.getters[GetterTypes.IS_LOGGING_IN];
    },
    isLogInError(): boolean {
      return this.$store.getters[GetterTypes.IS_LOGIN_ERROR];
    },
  },
  methods: {
    loginManual(payload: LoginManualPayload): void {
      this.$store.dispatch(ActionTypes.LOGIN_MANUAL, payload);
    },
    onSubmit(event: Event) {
      event.preventDefault();
      event.stopPropagation();

      const urlParams = new URLSearchParams(window.location.search);
      const closeAfterLogin = urlParams.get('closeAfterLogin');
      let callback: (() => void) | undefined;
      if (closeAfterLogin === 'true') {
        callback = window.close;
      }

      this.loginManual({
        username: this.username,
        password: this.password,
        callback,
      });
    },
  },
});
</script>

<style lang="scss" scoped>
.loading {
  align-self: center;
  width: 300px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.LogIn {
  display: flex;
  flex-direction: column;

  .header {
    margin-bottom: 24px;
  }
  .flex {
    flex: 1;
  }
  .bottom-row {
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    justify-content: space-between;
    padding-left: 12px;
  }
  .error-message {
    color: #eb5757;
  }
  .row {
    margin-bottom: 18px;
  }
  a {
    color: $textSecondary;
  }
}
</style>
