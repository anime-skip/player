<template>
  <ProgressOverlay :isLoading="true">
    <div class="sizing" />
  </ProgressOverlay>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ProgressOverlay from '@/common/components/ProgressOverlay.vue';

export default defineComponent({
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
