<template>
  <img :src="resolvedSrc" />
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Image extends Vue {
  /**
   * Path should be relative to the manifest.json
   */
  @Prop(String) public src!: string;
  public get resolvedSrc(): string {
    let getURL = (extUrl: string) => extUrl;
    // @ts-ignore
    if (browser) getURL = browser.runtime.getURL;
    // @ts-ignore
    else if (chrome) getURL = chrome.runtime.getURL;
    console.log('img:', getURL(this.src));
    return getURL(this.src);
  }
}
</script>

<style lang="scss" scoped>
.Image {
}
</style>
