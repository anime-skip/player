<template>
  <div class="PopupHeader">
    <h1 class="title" :class="{ small }">
      {{ title }}&ensp;
      <span class="subtitle" :class="{ small }">&bull;&ensp;Anime Skip</span>
    </h1>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    title: { type: String, required: true },
    small: Boolean,
  },
});
</script>

<style lang="scss" scoped>
.PopupHeader {
  .title {
    color: $textPrimary;
    font-size: 22px;
    font-weight: 700;
    padding: 0;
    margin: 0;

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
