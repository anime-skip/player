<template>
  <div class="PopupHeader">
    <h1 class="title" :class="{ small }">
      {{ title }}&ensp;
      <span class="subtitle" :class="{ small }">&bull;&ensp;Anime Skip</span>
    </h1>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class PopupHeader extends Vue {
  @Prop(String) public title!: string;
  @Prop(Boolean) public small?: string;
}
</script>

<style lang="scss" scoped>
.PopupHeader {
  .title {
    color: $textPrimary;
    font-size: 22px;
    font-weight: 700;

    &.small {
      font-size: 18px;
    }
  }
  .subtitle {
    color: $textSecondary;
    font-size: 22px;
    font-weight: 400;

    &.small {
      font-size: 18px;
    }
  }
}
</style>
