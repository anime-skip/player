<template>
  <div class="Popup">
    <Loading v-if="isLoggingIn" />
    <LogIn v-if="!isLoggedIn" />
    <Preferences v-else />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Loading from '@/common/components/Loading.vue';
import LogIn from './components/LogIn.vue';
import Preferences from './components/Preferences.vue';
import { Getter, Action } from '@/common/utils/VuexDecorators';

@Component({
  components: {
    Loading,
    LogIn,
    Preferences,
  },
})
export default class Popup extends Vue {
  public token?: string = undefined;

  @Getter() public isLoggedIn?: boolean;
  @Getter() public isLoggingIn?: boolean;

  @Action() public initialLoad!: () => void;

  public created() {
    this.initialLoad();
  }

  public data() {
    return {
      isLoading: this.login,
    };
  }
}
</script>
