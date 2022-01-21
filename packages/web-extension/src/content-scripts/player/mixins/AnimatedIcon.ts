import { defineComponent } from 'vue';

function linear(from: number, to: number, percent: number): number {
  return (to - from) * percent + from;
}

export default defineComponent({
  props: {
    state: { type: Number, required: true },
    durationMs: { type: Number, default: 200 },
  },
  data() {
    return {
      startState: this.state,
      finishState: this.state,
      maxState: this.state,
      minState: this.state,

      animating: false,
      percent: 1,
      startedAtMs: 0,
      timeout: undefined as number | undefined,
    };
  },
  watch: {
    state(newState: number, oldState: number): void {
      this.startState = oldState;
      this.finishState = newState;
      this.maxState = Math.max(newState, oldState);
      this.minState = Math.min(newState, oldState);
      if (this.timeout != null) clearTimeout(this.timeout);
      this.startAnimation();
    },
  },
  computed: {
    path(): string {
      const path = this.getPath().map<string>(shape =>
        shape
          .map(positions => {
            const x = linear(
              positions[this.startState][0],
              positions[this.finishState][0],
              this.percent
            );
            const y = linear(
              positions[this.startState][1],
              positions[this.finishState][1],
              this.percent
            );
            return `${x} ${y}`;
          })
          .join(' L')
      );
      return `M${path.join('z M')}Z`;
    },
  },
  methods: {
    startAnimation(): void {
      this.animating = true;
      this.startedAtMs = Date.now();
      this.timeout = window.setTimeout(() => (this.animating = false), this.durationMs);
      requestAnimationFrame(this.updateAnimatedState);
    },
    updateAnimatedState(): void {
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
    },

    // Overwrite this method
    getPath(): [[number, number], [number, number]][][] {
      return [];
    },
  },
});
