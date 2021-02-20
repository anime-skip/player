<template>
  <h5 class="pb-2">
    <span class="text-opacity-high font-bold">{{ title }}</span>
    <span class="text-opacity-low">&ensp;&bull;&ensp;</span>
    <span class="text-primary">Anime Skip</span>
  </h5>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    title: { type: String, required: true },
  },
});
</script>

<style lang="scss" scoped>
// .PopupHeader {
//   .title {
//     // color: $textPrimary;
//     font-size: 22px;
//     font-weight: 700;
//     padding: 0;
//     margin: 0;

//     &.small {
//       font-size: 18px;
//     }
//   }
//   .subtitle {
//     // color: $textSecondary;
//     font-size: 22px;
//     font-weight: 400;

//     &.small {
//       font-size: 18px;
//     }
//   }
// }
</style>
