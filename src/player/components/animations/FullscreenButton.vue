<template>
  <div class="FullscreenButton">
    <svg width="24" height="24" viewBox="0 0 24 24">
      <path fill="white" :d="path" />
    </svg>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AnimatedIcon from '@/common/mixins/AnimatedIcon';

export default defineComponent({
  mixins: [AnimatedIcon],
  methods: {
    getPath(): [[number, number], [number, number]][][] {
      // prettier-ignore
      return [
      [
        [[7, 5],  [9, 5]],
        [[9, 5],  [9, 7]],
        [[9, 10], [6, 7]],
        [[4, 10], [6, 10]],
        [[4, 8],  [4, 10]],
        [[7, 8],  [4, 5]],
      ],
      [
        [[17, 8],  [20, 5]],
        [[20, 8],  [20, 10]],
        [[20, 10], [18, 10]],
        [[15, 10], [18, 7]],
        [[15, 5],  [15, 7]],
        [[17, 5],  [15, 5]],
      ],
      [
        [[9, 14], [6, 17]],
        [[9, 19], [9, 17]],
        [[7, 19], [9, 19]],
        [[7, 16], [4, 19]],
        [[4, 16], [4, 14]],
        [[4, 14], [6, 14]],
      ],
      [
        [[15, 14], [18, 17]],
        [[20, 14], [18, 14]],
        [[20, 16], [20, 14]],
        [[17, 16], [20, 19]],
        [[17, 19], [15, 19]],
        [[15, 19], [15, 17]],
      ],
    ];
    },
  },
});
</script>

<style lang="scss" scoped>
.FullscreenButton {
  height: 24px;
}
</style>
