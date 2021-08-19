<template>
  <div>
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ActionTypes } from '../store/actionTypes';
import { MutationTypes } from '../store/mutationTypes';
import { State } from '../store/state';
import Browser from '../utils/Browser';

export default defineComponent({
  created() {
    Browser.storage.addListener(this.onStorageChanged);
    this.$store.dispatch(ActionTypes.INITIAL_LOAD);
  },
  methods: {
    onStorageChanged(changes: Partial<State>): void {
      this.$store.commit(MutationTypes.RESTORE_STATE, { changes });
    },
  },
});
</script>

<style></style>
