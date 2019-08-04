<template>
  <div class="Popup">
    <Loading v-if="loginState === undefined" />
    <LogIn v-else-if="loginState === false" />
    <Preferences v-else />
    <Toast
      message="Failed to update preferences"
      :visible="preferenceChangeError"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Loading from './components/Loading.vue';
import LogIn from './components/LogIn.vue';
import Preferences from './components/Preferences.vue';
import { Getter, Action } from '../../shared/utils/VuexDecorators';
import Toast from './components/Toast.vue';

@Component({
  components: {
    Loading,
    LogIn,
    Preferences,
    Toast,
  },
})
export default class Popup extends Vue {
  public token?: string = undefined;

  @Getter('loginState') public loginState?: boolean;
  @Getter('preferenceChangeError') public preferenceChangeError!: boolean;

  @Action('initialLoad') public initialLoad!: () => void;

  public created() {
    this.initialLoad();
  }
}
</script>
