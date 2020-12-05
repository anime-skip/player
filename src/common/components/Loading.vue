<template>
  <ProgressOverlay :isLoading="true">
    <div class="sizing" />
  </ProgressOverlay>
</template>

<script lang="ts">
import Vue from 'vue';
import ProgressOverlay from '@/common/components/ProgressOverlay.vue';

export default Vue.extend({
  components: { ProgressOverlay },
});
</script>

<style lang="scss" scoped>
.Loading {
  .sizing {
    width: 250px;
    height: 175px;
  }
}
</style>
