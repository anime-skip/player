<template>
  <div class="AutocompleteTextInput">
    <TextInput
      ref="input"
      :label="label"
      :errorMessage="errorMessage"
      :leftIcon="leftIcon"
      v-model="searchValue"
      :disabled="disabled"
      @focus="onFocusInput"
      @blur="onBlurInput"
      @keypress-esc="onPressEsc"
      @keydown.enter.native.prevent.stop="selectHightlightedOption"
      @keydown.up.native.prevent.stop="selectUp"
      @keydown.down.native.prevent.stop="selectDown"
    />
    <!-- @mousedown.prevent: prevent input from losing focus when clicking on an item -->
    <div
      v-if="shouldShowSuggestions && options.length > 0"
      class="suggestions"
      @mousedown.prevent
      @mouseover="onHoverOptions"
    >
      <div
        v-for="(option, index) of options"
        :key="option.id"
        class="default-option"
        :class="{ selected: option.id === value.id, highlight: index === highlightedIndex }"
        @click="onClickOption(option)"
      >
        <slot name="option" :option="option" :click="onClickOption">
          <p class="title">{{ option.title }}</p>
          <p v-if="option.subtitle" class="subtitle">{{ option.subtitle }}</p>
        </slot>
      </div>
    </div>
    <div
      v-if="shouldShowSuggestions && options.length === 0 && !!searchValue"
      class="suggestions"
      @mousedown.prevent
    >
      <p class="no-results">{{ noOptionsMessage }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import TextInput from './TextInput.vue';

interface AutocompleteItem {
  id?: string;
  title: string;
  subtitle?: string;
}

@Component({
  components: { TextInput },
})
export default class AutocompleteTextInput extends Vue {
  @Prop({ type: Object, required: true }) private value!: AutocompleteItem;
  @Prop(String) private label!: string;
  @Prop(String) private errorMessage?: string;
  @Prop({ type: String, default: 'No results' }) private noOptionsMessage!: string;
  @Prop({ type: Array, required: true }) private options!: AutocompleteItem[];
  @Prop(String) private leftIcon?: string;
  @Prop({ type: Number, default: 300 }) private searchDelay?: number;
  @Prop(Boolean) private disabled?: boolean;

  @Watch('value')
  public onChangeValue(value: AutocompleteItem) {
    this.inputValue = value;
  }

  private searchValue = '';
  private searchTimeout?: any;
  private isFocused: boolean = false;
  private isMouseOver: boolean = false;
  private wasEscPressed: boolean = false;
  private highlightedIndex: number = -1;

  public mounted(): void {
    if (this.value) {
      this.searchValue = this.value.title;
      this.$emit('search', this.searchValue.trim());
    }
    this.highlightedIndex = -1;
  }

  @Watch('searchValue')
  public onChangeSearchValue(): void {
    // Setup search timeout
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    this.searchTimeout = setTimeout(() => {
      this.$emit('search', this.searchValue.trim());
    }, this.searchDelay);

    // highlight index
    this.highlightedIndex = this.searchValue.trim() ? -1 : 0;

    // Update parent
    if (this.searchValue !== this.inputValue.title) {
      this.inputValue = {
        title: this.searchValue,
      };
    }
  }

  @Watch('options')
  public onChangeOptions(options: AutocompleteItem[]) {
    this.highlightedIndex = options.length === 0 ? -1 : 0;
  }

  public onHoverOptions() {
    this.highlightedIndex = -1;
  }

  public get shouldShowSuggestions(): boolean {
    return !this.wasEscPressed && (this.isFocused || this.isMouseOver);
  }

  public onFocusInput() {
    this.wasEscPressed = false;
    this.isFocused = true;
    this.$emit('focus');
  }

  public onBlurInput() {
    this.isFocused = false;
    this.$emit('blur');
    setTimeout(() => {
      if (this.searchValue !== this.inputValue.title) {
        this.inputValue = {
          title: this.searchValue,
        };
      }
    }, 0);
  }

  public onClickOption(option: AutocompleteItem) {
    this.inputValue = option;
    this.onPressEsc();
    this.$emit('select', option);
  }

  public onPressEsc() {
    this.wasEscPressed = true;
    (document.activeElement as any).blur();
  }

  public selectHightlightedOption() {
    const newSelection = this.options[this.highlightedIndex];
    if (newSelection == null) {
      return console.warn(
        'Could not select index ' +
          this.highlightedIndex +
          ' from ' +
          this.options.length +
          ' options'
      );
    }
    this.onClickOption(newSelection);
  }

  public get inputValue(): AutocompleteItem {
    return this.value;
  }
  public set inputValue(value: AutocompleteItem) {
    this.searchValue = value.title;
    this.$emit('input', value);
  }

  public selectUp() {
    if (this.options.length === 0) {
      this.highlightedIndex = -1;
    } else {
      this.highlightedIndex =
        (this.highlightedIndex === -1 ? this.options.length - 1 : this.highlightedIndex - 1) %
        this.options.length;
    }
  }

  public selectDown() {
    if (this.options.length === 0) {
      this.highlightedIndex = -1;
    } else {
      this.highlightedIndex = (this.highlightedIndex + 1) % this.options.length;
    }
  }
}
</script>

<style lang="scss">
$borderRadius: 3px;
$optionHeight: 48px;

.AutocompleteTextInput {
  position: relative;

  .suggestions {
    position: absolute;
    left: 0;
    right: 0;
    top: 48px - 1px;
    background-color: $input500;
    border-bottom-left-radius: $borderRadius;
    border-bottom-right-radius: $borderRadius;
    // padding-top: $borderRadius;
    overflow-y: auto;
    z-index: 100;
    max-height: 6 * $optionHeight;
    filter: drop-shadow(0px 6px 12px rgba(0, 0, 0, 0.48));

    &.invalid {
      background-color: $red500;
    }

    .suggestions-wrapper {
      background-color: $input500;
    }
  }

  .default-option {
    height: $optionHeight;
    border-top: 1px solid $divider;
    background-color: $input700;
    padding: 0 16px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    cursor: pointer;
    transition: 200ms;

    &.selected {
      border-top: 1px solid transparent;
      background-color: $divider;
    }

    &:hover,
    &.highlight {
      background-color: $primary700;
    }

    &:hover:active {
      background-color: $primary500;
    }

    .title {
      padding-top: 2px;
      font-size: 15px;
      color: $textPrimary;
    }

    .subtitle {
      color: $textSecondary;
      margin-top: -1px;
      font-size: 13px;
    }
  }

  .no-results {
    color: $textPrimary;
    padding: 8px 16px;
    background-color: $input700;
    text-align: center;
  }
}
</style>
