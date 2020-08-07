<template>
  <ProgressOverlay :isLoading="isLoggingIn">
    <form class="LogIn" ref="form">
      <PopupHeader title="Log In" class="header" :small="small" />
      <TextInput
        class="flex row"
        leftIcon="ic_account.svg"
        label="Username"
        autocomplete="username"
        v-model="username"
      />
      <TextInput
        class="flex row"
        leftIcon="ic_password.svg"
        label="Password"
        :errorMessage="isLogInError ? 'Username or password is incorrect' : undefined"
        autocomplete="current-password"
        type="password"
        v-model="password"
      />
      <div class="bottom-row">
        <input type="submit" value="Log In" class="clickable focus button" />
        <a href="https://www.anime-skip.com/sign-up">Sign Up</a>
      </div>
    </form>
  </ProgressOverlay>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import TextInput from '@/common/components/TextInput.vue';
import { Action, Getter } from '@/common/utils/VuexDecorators';
import ProgressOverlay from '@/common/components/ProgressOverlay.vue';
import PopupHeader from './PopupHeader.vue';

@Component({
  components: { TextInput, ProgressOverlay, PopupHeader },
})
export default class LogIn extends Vue {
  public isError: boolean = false;
  public username: string = '';
  public password: string = '';

  @Prop(Boolean) public small?: string;

  @Getter() public isLoggingIn!: boolean;
  @Getter() public isLogInError!: boolean;

  @Action() public loginManual!: (payload: LoginManualPayload) => void;

  public mounted() {
    (this.$refs.form as Element).addEventListener('submit', this.onSubmit);
  }

  public onSubmit(event: Event) {
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
