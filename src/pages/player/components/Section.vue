<template>
  <div
    class="Section"
    :class="{ buffered, completed, skipped }"
    :style="{ left: `${left}%`, width: `${width}%` }"
  />
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Section extends Vue {
  @Prop(Object) public timestamp!: Api.Timestamp;
  @Prop(Number) public endTime!: number;
  @Prop(Number) public duration!: number;
  @Prop(Number) public currentTime?: number;
  @Prop(Boolean) public skipped?: boolean;
  @Prop(Boolean) public buffered?: boolean;
  @Prop(Boolean) public completed?: boolean;

  public get left(): number {
    return (this.timestamp.time / this.duration) * 100;
  }
  public get width(): number {
    if (this.currentTime == null || this.currentTime > this.endTime) {
      return (this.endTime / this.duration) * 100 - this.left;
    }
    return (this.currentTime / this.duration) * 100 - this.left;
  }
}
</script>

<style lang="scss" scoped>
.Section {
  position: absolute;
  background-color: rgba($color: $background300, $alpha: 0.75);
  height: 3px;
  top: 0;
}
.skipped {
  background-color: transparent;
}
.buffered {
  background-color: rgba($color: white, $alpha: 0.75);
}
.completed {
  background-color: $primary300;
}
</style>
