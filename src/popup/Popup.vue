<template>
  <LogIn v-if="!isLoggedIn" :small="small" :close-after-login="closeAfterLogin" :close="close" />
  <PopupPreferences v-else :small="small" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import LogIn from './components/LogIn.vue';
import PopupPreferences from './components/PopupPreferences.vue';
import { GetterTypes } from '@/common/store/getterTypes';
import { ActionTypes } from '@/common/store/actionTypes';

export default defineComponent({
  components: {
    LogIn,
    PopupPreferences,
  },
  props: {
    small: Boolean,
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
