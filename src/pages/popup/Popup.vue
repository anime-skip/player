<template>
  <div class="Popup">
    <!-- <Loading :v-if="loginState === LoginState.UNKOWN" /> -->
    <LogIn :v-if="loginState === 2" />
    <!-- <Preferences :v-if="loginState === LoginState.LOGGED_IN" /> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Browser from '../../shared/Browser';
import Loading from './components/Loading.vue';
import LogIn from './components/LogIn.vue';
import Preferences from './components/Preferences.vue';

export enum LoginState {
  UNKOWN, LOGGED_IN, LOGGED_OUT,
}

@Component({
  components: {
    Loading, LogIn, Preferences,
  },
})
export default class Popup extends Vue {
  public loginState: LoginState = LoginState.UNKOWN;
  public authToken?: string = undefined;

  public mounted(): void {
    Browser.storage
      .getItem<string>('auth_token')
      .then((token) => {
        console.log('got token', token);
        if (token) {
          this.authToken = token;
          this.loginState = LoginState.LOGGED_IN;
        } else {
          this.authToken = undefined;
          this.loginState = LoginState.LOGGED_OUT;
        }
      })
      .catch((err) => {
        console.error('failed to get token', err);
      });
  }

}
</script>

<style lang="scss">
.Popup {
  padding: 16px;
}
</style>
