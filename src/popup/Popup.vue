<template>
  <div class="Popup">
    <Loading v-if="isLoggingIn" />
    <LogIn v-if="!isLoggedIn" :small="small" />
    <Preferences v-else :small="small" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Loading from '@/common/components/Loading.vue';
import LogIn from './components/LogIn.vue';
import Preferences from './components/Preferences.vue';

export default Vue.extend({
  components: {
    Loading,
    LogIn,
    Preferences,
  },
  props: {
    small: Boolean,
  },
  computed: {
    isLoggedIn(): boolean {
      return this.$store.getters.isLoggedIn;
    },
    isLoggingIn(): boolean {
      return this.$store.getters.isLoggingIn;
    },
  },
});
</script>

<style lang="scss" scoped>
.Popup {
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
</style>
