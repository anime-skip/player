<template>
  <div class="Popup">
    <p>Vue Popup Page</p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Popup extends Vue {}
</script>

<style lang="scss">
.Popup {
  padding: 24px;
}
</style>
