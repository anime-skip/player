<template>
  <div class="Popup">
    <Loading v-if="isLoggingIn" />
    <LogIn v-if="!isLoggedIn" :small="small" />
    <Preferences v-else :small="small" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import Loading from '@/common/components/Loading.vue';
import LogIn from './components/LogIn.vue';
import Preferences from './components/Preferences.vue';
import { Getter } from '@/common/utils/VuexDecorators';

@Component({
  components: {
    Loading,
    LogIn,
    Preferences,
  },
})
export default class Popup extends Vue {
  @Prop(Boolean) public small?: string;

  @Getter() public isLoggedIn?: boolean;
  @Getter() public isLoggingIn?: boolean;
}
</script>

<style lang="scss" scoped>
.Popup {
  min-width: 250px;
}
</style>
