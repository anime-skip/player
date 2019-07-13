<template>
  <div class="Popup">
    <p>Welcome to Anime Skip</p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Popup extends Vue {}
</script>

<style lang="scss">
.Popup {
  padding: 16px;
}
</style>
