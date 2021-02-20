<template>
  <div class="Section" :class="{ buffered, completed, skipped, current }" :style="positioning" />
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';

export default defineComponent({
  props: {
    timestamp: { type: Object as PropType<Api.Timestamp>, required: true },
    endTime: { type: Number, required: true },
    duration: { type: Number, required: true },
    currentTime: Number,
    skipped: Boolean,
    buffered: Boolean,
    completed: Boolean,
  },
  setup(props) {
    const left = computed<number>(() => {
      return (props.timestamp.at / props.duration) * 100;
    });
    const width = computed<number>(() => {
      if (props.currentTime == null || props.currentTime > props.endTime) {
        return (props.endTime / props.duration) * 100 - left.value;
      }
      if (props.currentTime < props.timestamp.at) {
        return 0;
      }
      return (props.currentTime / props.duration) * 100 - left.value;
    });
    const positioning = computed(() => ({ left: `${left.value}%`, width: `${width.value}%` }));

    const current = computed<boolean>(() => {
      if (props.currentTime == null) return false;

      return props.currentTime >= props.timestamp.at && props.currentTime <= props.endTime;
    });

    return {
      positioning,
      current,
    };
  },
});
</script>

<style lang="scss" scoped>
.Section {
  position: absolute;
  // background-color: rgba($color: $background300, $alpha: 0.75);
  height: 3px;
  border-radius: 1.5px;
}
.skipped {
  background-color: transparent;
}
.buffered {
  background-color: rgba($color: white, $alpha: 0.75);
}
.completed {
  // background-color: $primary300;
}
.current {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
</style>
