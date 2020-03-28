<template>
  <div class="AutocompleteTextInput">
    <TextInput
      :label="label"
      :errorMessage="errorMessage"
      :autocomplete="autocomplete"
      :defaultValue="defaultValue"
      :type="type"
      :leftIcon="leftIcon"
      :isValid="isValid"
      v-model="inputValue"
      @focus="onFocusInput"
      @blur="onBlurInput"
      @keypress-esc="onPressEsc"
    />
    <!-- @mousedown.prevent: prevent input from losing focus when clicking on an item -->
    <div
      v-if="shouldShowSuggestions"
      class="suggestions"
      :class="{ invalid: !isValid }"
      @mousedown.prevent
    >
      <div class="suggestions-wrapper">
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import TextInput from './TextInput.vue';

@Component({
  components: { TextInput },
})
export default class AutocompleteTextInput extends Vue {
  @Prop(String) private value?: string;
  @Prop(String) private label!: string;
  @Prop(String) private errorMessage?: string;
  @Prop(String) private autocomplete?: 'username' | 'current-password';
  @Prop(String) private defaultValue?: string;
  @Prop({ default: 'text' }) private type!: 'text' | 'password';
  @Prop(String) private leftIcon?: string;
  @Prop({ type: Boolean, required: false, default: true }) isValid!: boolean;
  @Prop(Boolean) isShowingSuggestions!: boolean;

  private isFocused: boolean = false;
  private isMouseOver: boolean = false;
  private wasEscPressed: boolean = false;

  public get shouldShowSuggestions(): boolean {
    return !!this.inputValue && !this.wasEscPressed && (this.isFocused || this.isMouseOver);
  }

  public onFocusInput() {
    this.isFocused = true;
    this.$emit('focus');
  }

  public onBlurInput() {
    this.isFocused = false;
    this.$emit('focus');
  }

  public onPressEsc() {
    this.wasEscPressed = true;
  }

  public get inputValue() {
    return this.value;
  }
  public set inputValue(value) {
    this.wasEscPressed = false;
    this.$emit('input', value);
  }
}
</script>

<style lang="scss">
$borderRadius: 3px;

.AutocompleteTextInput {
  position: relative;

  .suggestions {
    position: absolute;
    left: 0;
    right: 0;
    top: 48px - $borderRadius;
    background-color: $input500;
    border-bottom-left-radius: $borderRadius;
    border-bottom-right-radius: $borderRadius;
    padding-top: $borderRadius;
    overflow-y: auto;
    z-index: 100;

    &.invalid {
      background-color: $red500;
    }

    .suggestions-wrapper {
      background-color: $input500;
    }
  }
}
</style>
