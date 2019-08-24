<template>
  <div class="FullscreenButton">
    <svg width="24" height="24" viewBox="0 0 24 24">
      <path fill="white" :d="path" />
    </svg>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component
export default class FullscreenButton extends Vue {
  @Prop(Number) public state!: number;
  @Prop({ type: Number, default: 200 }) public durationMs!: number;

  public startState: number = this.state;
  public finishState: number = this.state;
  public maxState: number = this.state;
  public minState: number = this.state;

  public animating: boolean = false;
  public percent: number = 1;
  public startedAtMs: number = 0;
  public timeout?: number;

  @Watch('state')
  public onChangeState(newState: number, oldState: number) {
    console.log('state changed: ', oldState, 'to', newState, this.state);
    this.startState = oldState;
    this.finishState = newState;
    this.maxState = Math.max(newState, oldState);
    this.minState = Math.min(newState, oldState);
    if (this.timeout != null) clearTimeout(this.timeout);
    this.startAnimation();
  }

  public startAnimation() {
    this.animating = true;
    this.startedAtMs = Date.now();
    this.timeout = setTimeout(() => (this.animating = false), this.durationMs);
    requestAnimationFrame(this.updateAnimatedState);
  }

  public updateAnimatedState() {
    if (!this.animating) return;
    const now = Date.now();
    this.percent = (now - this.startedAtMs) / this.durationMs;
    if (this.percent > 1) {
      this.animating = false;
      this.percent = 1;
    } else if (this.percent < 0) {
      this.animating = false;
      this.percent = 0;
    }
    requestAnimationFrame(this.updateAnimatedState);
  }

  public linear(from: number, to: number, percent: number): number {
    return (to - from) * percent + from;
  }

  public getPath(): [[number, number], [number, number]][][] {
    return [];
  }

  /* eslint-disable @typescript-eslint/indent */
  public get path(): string {
    const path = this.getPath()
      .map<string>(shape =>
        shape
          .map(positions => {
            const x = this.linear(
              positions[this.startState][0],
              positions[this.finishState][0],
              this.percent
            );
            const y = this.linear(
              positions[this.startState][1],
              positions[this.finishState][1],
              this.percent
            );
            return `${x} ${y}`;
          })
          .join(' L')
      )
      .join('z M');
    return `M${path}Z`;
  }
  /* eslint-enable @typescript-eslint/indent */
}
</script>

<style lang="scss" scoped>
.FullscreenButton {
}
</style>
