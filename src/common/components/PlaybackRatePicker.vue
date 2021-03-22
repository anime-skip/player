<template>
  <div class="PlaybackRatePicker">
    <div
      class="flex items-stretch justify-items-stretch h-10 w-full divide-x-2 divide-background rounded-sm bg-control"
    >
      <Icon path="M4 18L12.5 12L4 6V18ZM13 6V18L21.5 12L13 6Z" class="my-2 w-10" />
      <div v-for="speed in PLAYBACK_SPEEDS" :key="speed.value" class="flex-1 min-w-10">
        <RaisedContainer
          class="cursor-pointer text-on-surface box-border w-full h-full"
          :down="!isRateSelected(speed.value)"
          :dark="!isRateSelected(speed.value)"
          @click="onClickOption(speed.value)"
        >
          <span
            class="transition-colors"
            :class="{ 'text-on-primary': isRateSelected(speed.value) }"
            >{{ speed.display }}</span
          >
        </RaisedContainer>
      </div>
      <div class="flex-1 min-w-10 box-border">
        <RaisedContainer
          :down="!customRate"
          :dark="!customRate"
          :error="isCustomError"
          class="w-full p-0"
          :tabindex="-1"
        >
          <input
            type="text"
            step="0.01"
            :maxlength="4"
            class="bg-transparent w-full h-10 text-center"
            :class="{
              'caret-white': !isCustomError,
              'bg-error text-on-error': isCustomError,
            }"
            placeholder="?.?"
            :value="customRate"
            @input="onChangeCustom"
            @blur="onBlurCustom()"
          />
        </RaisedContainer>
      </div>
    </div>
    <div v-if="isCustomError" class="body-2 text-error mt-2">Custom speeds: 0.5 - 4</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { PLAYBACK_SPEEDS } from '@/common/utils/Constants';
import { MutationTypes } from '../store/mutationTypes';

export default defineComponent({
  props: {
    showLess: Boolean,
  },
  mounted(): void {
    if (!this.isConstantSelected) {
      this.customRate = String(this.playbackRate);
    }
  },
  data() {
    return {
      customRate: '',
      PLAYBACK_SPEEDS: PLAYBACK_SPEEDS.filter(speed => !speed.hideWhenSmall || !this.showLess),
    };
  },
  watch: {
    playbackRate() {
      this.onChangePlaybackRate();
    },
  },
  computed: {
    playbackRate(): number {
      return this.$store.state.playbackRate;
    },
    isConstantSelected(): boolean {
      return !!this.PLAYBACK_SPEEDS.find(
        (speed: PlaybackRate) => speed.value === this.playbackRate
      );
    },
    isCustomError(): boolean {
      if (!this.customRate) return false;

      const value = Number(this.customRate);
      if (!isFinite(value)) return true;

      return value < 0.5 || value > 4;
    },
  },
  methods: {
    isRateSelected(speed: number): boolean {
      return this.playbackRate === speed && !this.customRate;
    },
    changePlaybackRate(speed: number): void {
      this.$store.commit(MutationTypes.CHANGE_PLAYBACK_RATE, speed);
    },
    onChangePlaybackRate() {
      if (!this.isConstantSelected) {
        this.customRate = this.playbackRate ? String(this.playbackRate) : '';
      }
    },
    onClickOption(value: number) {
      this.customRate = '';
      this.changePlaybackRate(Number(value));
    },
    onChangeCustom(event: Event) {
      const { value } = event.target as HTMLInputElement;
      this.customRate = value;
    },
    onBlurCustom() {
      const value = this.customRate;
      this.changePlaybackRate(Number(value));
      if (this.isConstantSelected) {
        this.customRate = '';
      }
      if (this.isCustomError) {
        return;
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.bg-transparent {
  background: transparent;
}

.caret-white {
  caret-color: white;
}

input {
  min-width: 0 !important;
}

.min-w-10 {
  flex-basis: 2.5rem;
}
</style>
