<template>
  <div class="PlayPauseButton">
    <svg width="24" height="24" viewBox="0 0 24 24">
      <path fill="white" :d="path" />
    </svg>
  </div>
</template>

<script lang="ts">
import vueMixins from 'vue-typed-mixins';
import AnimatedIcon from '@/common/mixins/AnimatedIcon';

export default vueMixins(AnimatedIcon).extend({
  methods: {
    getPath(): [[number, number], [number, number]][][] {
      // prettier-ignore
      return [
      [
        [[6, 5], [7, 5]],
        [[10, 5], [13, 8.82]],
        [[10, 19], [13, 15.18]],
        [[6, 19], [7, 19]],
      ],
      [
        [[14, 5], [11, 7.55]],
        [[18, 5], [18, 12]],
        [[18, 19], [18, 12]],
        [[14, 19], [11, 16.45]],
      ],
    ];
    },
  },
});
</script>

<style lang="scss" scoped>
.PlayPauseButton {
  height: 24px;
}
</style>
