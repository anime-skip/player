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
import Loading from '@/common/components/Loading.vue';
import LogIn from './components/LogIn.vue';
import Preferences from './components/Preferences.vue';
import { Getter, Action } from '@/common/utils/VuexDecorators';
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

  @Getter() public loginState?: boolean;
  @Getter() public preferenceChangeError!: boolean;

  @Action() public initialLoad!: () => void;

  public created() {
    this.initialLoad();
  }
}
</script>
