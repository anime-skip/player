<template>
  <ProgressOverlay :isLoading="true">
    <div class="sizing" />
  </ProgressOverlay>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Loading extends Vue {}
</script>

<style lang="scss" scoped>
.Loading {
  .sizing {
    width: 250px;
    height: 175px;
  }
}
</style>
