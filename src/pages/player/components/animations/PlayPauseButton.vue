<template>
  <div class="PlayPauseButton">
    <svg width="24" height="24" viewBox="0 0 24 24">
      <path fill="white" :d="path" />
    </svg>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component
export default class PlayPauseButton extends Vue {
  @Prop(Boolean) public isPaused!: boolean;

  public animating: boolean = false;
  public value: number = 1;
  public startValue: number = 1;
  public finishValue: number = 1;
  public durationMs: number = 200;
  public startedAtMs: number = 0;

  @Watch('isPaused')
  public onChangeIsPaused(isPaused: boolean) {
    console.log('Watch triggered with', isPaused);
    this.startValue = this.value;
    if (isPaused) {
      this.finishValue = 1;
    } else {
      this.finishValue = 0;
    }
    this.startAnimation();
  }

  public startAnimation() {
    this.animating = true;
    this.startedAtMs = Date.now();
    setTimeout(() => (this.animating = false), this.durationMs);
    requestAnimationFrame(this.updateAnimatedValue);
  }

  public updateAnimatedValue() {
    if (!this.animating) return;
    const now = Date.now();
    const percent = (now - this.startedAtMs) / this.durationMs;
    this.value = this.linear(this.startValue, this.finishValue, percent);
    if (this.value > 1) {
      this.animating = false;
      this.value = 1;
    } else if (this.value < 0) {
      this.animating = false;
      this.value = 0;
    }
    requestAnimationFrame(this.updateAnimatedValue);
  }

  public linear(from: number, to: number, percent: number): number {
    return (to - from) * percent + from;
  }

  public get path(): string {
    const left: [[number, number], [number, number]][] = [
      [[6, 5], [7, 5]],
      [[10, 5], [13, 8.82]],
      [[10, 19], [13, 15.18]],
      [[6, 19], [7, 19]],
    ];
    const right: [[number, number], [number, number]][] = [
      [[14, 5], [11, 7.55]],
      [[18, 5], [18, 12]],
      [[18, 19], [18, 12]],
      [[14, 19], [11, 16.45]],
    ];
    const path = `M${left
      .map(positions => {
        const x = this.linear(positions[0][0], positions[1][0], this.value);
        const y = this.linear(positions[0][1], positions[1][1], this.value);
        return `${x} ${y}`;
      })
      .join(' L')}z M${right
      .map(positions => {
        const x = this.linear(positions[0][0], positions[1][0], this.value);
        const y = this.linear(positions[0][1], positions[1][1], this.value);
        return `${x} ${y}`;
      })
      .join(' L')}`;
    return path;
  }
}
</script>

<style lang="scss" scoped>
.PlayPauseButton {
}
</style>
