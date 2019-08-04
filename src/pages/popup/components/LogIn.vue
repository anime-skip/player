<template>
  <ProgressOverlay :isLoading="isLoggingIn">
    <form class="LogIn" ref="form">
      <PopupHeader title="Log In" class="header" />
      <TextInput
        class="flex row"
        leftIcon="img/ic-account.svg"
        hint="Username"
        autocomplete="username"
        v-model="username"
      />
      <TextInput
        class="flex row"
        leftIcon="img/ic-password.svg"
        hint="Password"
        autocomplete="current-password"
        type="password"
        v-model="password"
      />
      <p class="error-message row" v-if="isError">
        Username or password was incorrect
      </p>
      <div class="bottom-row">
        <input type="submit" value="Log In" class="clickable focus button" />
        <a href="https://www.anime-skip.com/sign-up">Sign Up</a>
      </div>
    </form>
  </ProgressOverlay>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import TextInput from '@Shared/components/TextInput.vue';
import { Action, Getter } from '../../../shared/utils/VuexDecorators';
import ProgressOverlay from '../../../shared/components/ProgressOverlay.vue';
import PopupHeader from './PopupHeader.vue';

@Component({
  components: { TextInput, ProgressOverlay, PopupHeader },
})
export default class LogIn extends Vue {
  public isError: boolean = false;
  public username: string = 'aklinker1';
  public password: string = 'password';

  @Getter('isLoggingIn') public isLoggingIn!: boolean;

  @Action('loginManual') public loginManual!: (
    payload: LoginManualPayload
  ) => void;

  public mounted() {
    console.log('login component', this.isLoggingIn);
    (this.$refs.form as Element).addEventListener('submit', this.onSubmit);
  }

  public onSubmit(event: Event) {
    console.log('onSumbit');
    event.preventDefault();
    event.stopPropagation();
    this.loginManual({
      username: this.username,
      password: this.password,
    });
  }
}
</script>

<style lang="scss" scoped>
.LogIn {
  display: flex;
  flex-direction: column;
  padding: 32px 40px;
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
