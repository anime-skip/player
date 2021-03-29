<template>
  <div :class="browser" class="flex items-center justify-center">
    <LogIn v-if="!isLoggedIn" :small="small" :close-after-login="closeAfterLogin" :close="close" />
    <div v-else-if="closeAfterLogin" class="mt-20">
      <Loading />
    </div>
    <PopupPreferences v-else :small="small" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import LogIn from './components/LogIn.vue';
import PopupPreferences from './components/PopupPreferences.vue';
import { GetterTypes } from '@/common/store/getterTypes';
import { ActionTypes } from '@/common/store/actionTypes';
import Browser from '@/common/utils/Browser';

export default defineComponent({
  components: {
    LogIn,
    PopupPreferences,
  },
  props: {
    small: Boolean,
  },
  data() {
    return {
      browser: Browser.detect(),
    };
  },
  mounted(): void {
    this.$store.dispatch(ActionTypes.INITIAL_LOAD, undefined);
  },
  computed: {
    isLoggedIn(): boolean {
      return this.$store.state.isLoggedIn;
    },
    isLoggingIn(): boolean {
      return this.$store.getters[GetterTypes.IS_LOGGING_IN];
    },
    closeAfterLogin(): boolean {
      const urlParams = new URLSearchParams(window?.location.search);
      const closePopupAfterLogin = urlParams.get('closeAfterLogin');
      return closePopupAfterLogin === 'true';
    },
  },
  methods: {
    close() {
      window.close();
    },
  },
});
</script>

<style scoped>
.chrome {
  width: 600px;
  height: 500px;
}
</style>
