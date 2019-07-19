<template>
  <div class="Popup">
    <Loading v-if="loginState === undefined" />
    <LogIn v-else-if="loginState === false" />
    <Preferences v-else />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Browser from '../../shared/utils/Browser';
import Loading from './components/Loading.vue';
import LogIn from './components/LogIn.vue';
import Preferences from './components/Preferences.vue';
import { Getter, Action } from '../../shared/utils/VuexDecorators';

@Component({
  components: {
    Loading, LogIn, Preferences,
  },
})
export default class Popup extends Vue {
  public token?: string = undefined;

  @Getter('loginState') public loginState?: boolean;

  @Action('initialLoad') public initialLoad!: () => void;

  public created() {
    this.initialLoad();
  }

}
</script>

<style lang="scss">
.Popup {
  padding: 16px;
}
</style>
