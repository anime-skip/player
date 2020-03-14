<template>
  <div class="Options">
    <p>Vue Options Page!</p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Options extends Vue {}
</script>

<style lang="scss">
.Options {
  padding: 12px 0;
}
</style>
