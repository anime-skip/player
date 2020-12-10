<template>
  <div class="Popup">
    <Loading v-if="isLoggingIn" />
    <LogIn v-if="!isLoggedIn" :small="small" />
    <Preferences v-else :small="small" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Loading from '@/common/components/Loading.vue';
import LogIn from './components/LogIn.vue';
import Preferences from './components/Preferences.vue';
import { GetterTypes } from '@/common/store/getterTypes';

export default defineComponent({
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
      return this.$store.getters[GetterTypes.IS_LOGGED_IN];
    },
    isLoggingIn(): boolean {
      return this.$store.getters[GetterTypes.IS_LOGGING_IN];
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
