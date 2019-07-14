<template>
  <img :src="resolvedSrc" />
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Browser from '../Browser';

@Component
export default class Image extends Vue {
  /**
   * Path should be relative to the manifest.json
   */
  @Prop(String) public src!: string;
  public get resolvedSrc(): string {
    return Browser.resolveUrl(this.src);
  }
}
</script>
