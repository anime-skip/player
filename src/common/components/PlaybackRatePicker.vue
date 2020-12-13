<template>
  <div class="PlaybackRatePicker">
    <div class="container clickable dark down">
      <WebExtImg src="ic_playback_speed.svg" class="image" />
      <div
        v-for="speed in PLAYBACK_SPEEDS"
        :key="speed.value"
        class="option"
        :class="{ clickable: playbackRate === speed.value && !customRate }"
        @click="onClickOption(speed.value)"
      >
        {{ speed.display }}
      </div>
      <input
        type="text"
        step="0.01"
        maxlength="4"
        :class="{ clickable: !!customRate, error: isCustomError }"
        class="option"
        placeholder="?.?"
        :value="customRate"
        @input="onChangeCustom"
        @blur="onBlurCustom()"
      />
    </div>
    <div v-if="isCustomError" class="error-message">Custom speed must be between 0.5 and 4</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import WebExtImg from '@/common/components/WebExtImg.vue';
import { PLAYBACK_SPEEDS } from '@/common/utils/Constants';
import { MutationTypes } from '../store/mutationTypes';

export default defineComponent({
  components: { WebExtImg },
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
    onChangeCustom(event: InputEvent) {
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
$height: 40px;

.PlaybackRatePicker {
  display: flex;
  flex-direction: column;

  .container {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: $height;

    .image {
      padding-left: 8px;
      padding-right: 8px;
      width: $height + 1;
      height: $height;
      box-sizing: border-box;
      border-right: 1px solid $divider;
    }

    & > .option {
      cursor: pointer;
      flex: 1;
      flex-basis: 0;
      font-weight: 600;
      font-size: 14.5px;
      height: $height;
      line-height: $height;
      box-sizing: border-box;
      padding: 0;
      padding-top: 2px;
      text-align: center;
      &.clickable {
        border-left: none;
      }

      &[type='text'] {
        flex: unset;
        flex-basis: unset;
        width: 48px;
        color: white;
        background-color: transparent;
        border: none;
        border-left: 1px solid $divider;
        outline: none;
        text-align: center !important;
        -webkit-appearance: none;
        -moz-appearance: textfield;
        margin: 0;
        cursor: text;

        &.clickable {
          background-color: $primary500;
        }
        &.error {
          box-shadow: none;
          background-color: $red500;
          box-shadow: 0 3px 0 0 $red700;
          border-top-right-radius: 3px;
          border-bottom-right-radius: 3px;
        }
      }
    }
  }

  .error-message {
    align-self: center;
    text-align: right;
    margin-top: 4px;
  }
}
</style>
