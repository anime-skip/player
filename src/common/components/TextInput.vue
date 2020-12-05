<template>
  <div class="TextInput">
    <div
      class="input-wrapper clickable dark"
      :class="{ down: isFocused || value, invalid: !isValid, disabled }"
    >
      <WebExtImg class="icon" v-if="leftIcon" :class="{ focused: isFocused }" :src="leftIcon" />
      <input
        ref="input"
        class="input"
        v-model="inputValue"
        :type="type"
        :placeholder="label"
        :autocomplete="autocomplete || 'off'"
        :tabindex="disabled ? -1 : null"
        @focus="onFocus"
        @blur="onBlur"
        @keydown.esc.stop.prevent="onPressEsc"
        @keyup.enter="$emit('submit')"
      />
    </div>
    <span v-if="errorMessage" class="error-message">{{ errorMessage }}</span>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import WebExtImg from './WebExtImg.vue';

@Component({
  components: { WebExtImg },
})
export default class TextInput extends Vue {
  @Prop(String) private id?: string;
  @Prop({ type: String, required: true }) private label!: string;
  @Prop(String) private errorMessage?: string;
  @Prop(String) private autocomplete?: 'username' | 'current-password';
  @Prop(String) private defaultValue?: string;
  @Prop({ default: 'text' }) private type!: 'text' | 'password';
  @Prop(String) private leftIcon?: string;
  @Prop({ type: Boolean, required: false, default: true }) isValid!: boolean;
  @Prop(String) private value?: string;
  @Prop(Boolean) private disabled?: boolean;

  @Watch('value')
  public onChangeValue(value: string | undefined) {
    this.inputValue = value ?? '';
  }

  private isFocused = false;

  public onFocus() {
    this.$emit('focus');
    this.isFocused = true;
  }
  public focus(selectAll = false) {
    const input = this.$refs.input as HTMLInputElement | undefined;
    if (input) {
      if (selectAll) {
        input.setSelectionRange(0, input.value.length);
      }
      input.focus();
    } else {
      console.warn('Failed to focus on input, ref did not exist');
    }
  }

  public onBlur() {
    this.$emit('blur');
    this.isFocused = false;
  }
  public blur() {
    (this.$refs.input as HTMLInputElement | undefined)?.blur();
  }

  public get inputValue(): string {
    return this.value ?? this.defaultValue ?? '';
  }
  public set inputValue(value) {
    this.$emit('input', value);
  }

  public onPressEsc() {
    this.$emit('keypress-esc');
  }
}
</script>

<style lang="scss">
$colorNotActive: rgba(
  $color: black,
  $alpha: 0.24,
);
$colorFongNotActive: rgba(
  $color: black,
  $alpha: 0.32,
);
$transitionMs: 200ms;
$inputHeight: 48px;

.TextInput {
  display: flex;
  flex-direction: column;
  min-width: 0;

  .input-wrapper {
    display: flex;
    align-items: center;
    height: $inputHeight;
    border-radius: 3px;

    .icon {
      width: 24px;
      height: 24px;
      margin-left: 12px;
      opacity: 0.48;
      transition: $transitionMs;
      transition-property: opacity;
      &.focused {
        opacity: 0.9;
      }
    }
    .input {
      flex-basis: 0;
      flex-shrink: 1;
      flex-grow: 1;
      background-color: transparent;
      border: none;
      outline: none;
      height: $inputHeight;
      padding: 4px 12px 0 12px;
      box-sizing: border-box;
      font-size: 15px;
      font-weight: 500;
      line-height: $inputHeight;
      caret-color: $primary500;
      color: $textPrimary;
      min-width: 0;
      &::placeholder {
        color: $textSecondary;
      }
    }
  }

  .error-message {
    margin: 0 16px;
    margin-top: 8px;
  }
}
</style>
