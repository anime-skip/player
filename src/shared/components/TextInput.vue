<template>
  <div class="TextInput" :class="[filledClass, focusedClass, validityClass]">
    <div class="overlay">
      <input 
        class="input"
        ref="input"
        :type="type"
        v-model="value"
        @focus="onFocus"
        @blur="onBlur"
        :autocomplete="autocomplete || 'off'"
        @input="updateValue"
      >
      <div class="border"></div>
      <label class="label">{{label}}</label>
    </div>
    <div :class="help ? undefined : 'hidden'" class="help">{{help || ''}}</div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

export enum ValidState {
  NONE = -1,
  ERROR = 0,
  VALID = 1,
}

@Component
export default class TextInput extends Vue {
  @Prop() private label!: string;
  @Prop() private autocomplete?: 'username' | 'current-password';
  @Prop() private help?: string;
  @Prop() private defaultValue?: string;
  @Prop({ default: ValidState.NONE }) private validity?: ValidState;
  @Prop({ default: 'text' }) private type!: 'text' | 'password';

  private value: string = this.defaultValue || '';
  private isFocused: boolean = false;

  public get filledClass(): any {
    return this.value === '' && !this.isFocused ? '' : 'filled';
  }
  public get focusedClass(): any {
    return !this.isFocused ? '' : 'focused';
  }
  public get validityClass(): any {
    switch (this.validity) {
      case ValidState.NONE: return undefined;
      case ValidState.VALID: return 'valid';
      case ValidState.ERROR: return 'error';
    }
  }

  public onFocus(event: FocusEvent) {
    this.isFocused = true;
  }
  public onBlur(event: FocusEvent) {
    this.isFocused = false;
  }
  public updateValue({ target: { value } }: any) {
    this.value = value;
    this.$emit('input', value);
  }
  public loadInitialStates(): void {
    this.$emit(this.defaultValue || '');
  }

}
</script>

<style lang="scss">
$colorNotActive: rgba($color: black, $alpha: 0.24);
$colorFongNotActive: rgba($color: black, $alpha: 0.32);
$transitionMs: 200ms;
$inputHeight: 48px;
$errorRed: #f44336;
$validGreen: #4CAF50;

.TextInput {
  .overlay {
    position: relative;
    height: $inputHeight;
    width: 100%;
    border-radius: 4px;
    margin-top: 5px;
    & > * {
      position: absolute;
      left: 0;
      box-sizing: border-box;
    }
    .input {
      width: 100%;
      background-color: transparent;
      border: none;
      outline: none;
      padding-left: 14px;
      padding-right: 14px;
      font-size: 16px;
      line-height: $inputHeight;
      caret-color: $primary700;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      color: rgba($color: black, $alpha: 0.89);
    }
    .label {
      height: $inputHeight;
      line-height: $inputHeight;
      transition: $transitionMs;
      color: $colorFongNotActive;
      user-select: none;
      pointer-events: none;
      text-transform: capitalize;
      padding-left: 4px;
      padding-right: 4px;
      left: 8px;
      top: 0;
    }
    .border {
      width: 100%;
      height: 100%;
      border: 1px solid $colorNotActive;
      border-radius: 4px;
      user-select: none;
      pointer-events: none;
      transition: $transitionMs;
    }
  }
  .help {
    padding-top: 4px;
    height: 12px;
    line-height: 12px;
    font-size: 12px;
    color: $colorFongNotActive;
    text-align: start;
    padding-left: 14px;
    opacity: 1;
    transition: 100ms;
    &.hidden {
      opacity: 0;
      padding-top: 0;
      height: 0;
    }
  }
}
.TextInput.filled {
  .overlay {
    .label {
      font-weight: 500;
      font-size: 13px;
      top: -5px;
      background-color: white;
      height: 12px;
      line-height: 12px;
    }
    .border {
      border-width: 2px;
    }
  }
}
.TextInput.focused {
  .overlay {
    .label {
      color: rgba($color: $primary500, $alpha: 1.0);
      font-weight: 500;
    }
    .border {
      border-color: $primary500;
    }
  }
  .help {
    color: rgba($color: $primary500, $alpha: 1.0);
  }
}
.TextInput.error {
  .overlay {
    .label {
      color: rgba($color: $errorRed, $alpha: 1.0);
    }
    .border {
      border-color: $errorRed;
    }
  }
  .help {
    color: rgba($color: $errorRed, $alpha: 1.0);
  }
}
.TextInput.valid {
  .overlay {
    .label {
      color: rgba($color: $validGreen, $alpha: 1.0);
    }
    .border {
      border-color: $validGreen;
    }
  }
  .help {
    color: rgba($color: $validGreen, $alpha: 1.0);
  }
}
</style>
