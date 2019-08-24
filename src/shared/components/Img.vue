<template>
  <img :src="resolvedSrc" :draggable="draggable" />
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Browser from '../utils/Browser';

@Component
export default class Image extends Vue {
  /**
   * Path should be relative to the manifest.json
   */
  @Prop(String) public src!: string;
  @Prop(Boolean) public draggable?: boolean;
  public get resolvedSrc(): string {
    return Browser.resolveUrl(this.src);
  }
}
</script>
