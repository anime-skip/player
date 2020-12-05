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
        :key="option.key"
        class="default-option"
        :class="{ selected: option.key === value.key, highlight: index === highlightedIndex }"
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
import Vue from 'vue';
import type { PropValidator } from 'vue/types/options';
import TextInput from './TextInput.vue';

export default Vue.extend({
  components: { TextInput },
  props: {
    value: { type: Object, required: true } as PropValidator<AutocompleteItem>,
    label: String,
    errorMessage: String,
    noOptionsMessage: { type: String, default: 'No results' },
    options: { type: Array, required: true } as PropValidator<AutocompleteItem[]>,
    leftIcon: String,
    searchDelay: { type: Number, default: 300 },
    disabled: Boolean,
  },
  // emits: ["search"],
  mounted() {
    if (this.value) {
      this.searchValue = this.value.title;
      this.$emit('search', this.searchValue.trim());
    }
    this.highlightedIndex = -1;
  },
  data() {
    return {
      searchValue: '',
      searchTimeout: undefined as number | undefined,
      isFocused: false,
      isMouseOver: false,
      wasEscPressed: false,
      highlightedIndex: -1,
    };
  },
  watch: {
    value(value: AutocompleteItem) {
      this.setInputValue(value);
    },
    searchValue() {
      // Setup search timeout
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }
      this.searchTimeout = window.setTimeout(() => {
        this.$emit('search', this.searchValue.trim());
      }, this.searchDelay);

      // highlight index
      this.highlightedIndex = this.searchValue.trim() ? -1 : 0;

      // Update parent
      if (this.searchValue !== this.inputValue.title) {
        this.setInputValue({
            key: '',
          title: this.searchValue,
        });
      }
    },
    options(options: AutocompleteItem[]) {
      this.highlightedIndex = options.length === 0 ? -1 : 0;
    },
  },
  computed: {
    shouldShowSuggestions(): boolean {
      return !this.wasEscPressed && (this.isFocused || this.isMouseOver);
    },
    inputValue(): AutocompleteItem {
      return this.value;
    },
  },
  methods: {
    onHoverOptions() {
      this.highlightedIndex = -1;
    },
    focus() {
      // @ts-expect-error: Webpack doesn't like this
      const input: TextInput | undefined = this.$refs.input;
      input?.focus(true);
    },
    onFocusInput() {
      this.wasEscPressed = false;
      this.isFocused = true;
      this.$emit('focus');
    },
    onBlurInput() {
      this.isFocused = false;
      this.$emit('blur');
      setTimeout(() => {
        if (this.searchValue !== this.inputValue.title) {
          this.setInputValue({
            key: '',
            title: this.searchValue,
          });
        }
      }, 0);
    },
    onPressEsc() {
      this.wasEscPressed = true;
      (document.activeElement as HTMLElement | undefined)?.blur();
    },
    onClickOption(option: AutocompleteItem) {
      this.setInputValue(option);
      this.onPressEsc();
      this.$emit('select', option);
    },
    selectHightlightedOption() {
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
    },
    setInputValue(value: AutocompleteItem) {
      this.searchValue = value.title;
      if (value !== this.value) {
        this.$emit('input', value);
      }
    },
    selectUp() {
      if (this.options.length === 0) {
        this.highlightedIndex = -1;
      } else {
        this.highlightedIndex =
          (this.highlightedIndex === -1 ? this.options.length - 1 : this.highlightedIndex - 1) %
          this.options.length;
      }
    },
    selectDown() {
      if (this.options.length === 0) {
        this.highlightedIndex = -1;
      } else {
        this.highlightedIndex = (this.highlightedIndex + 1) % this.options.length;
      }
    }
  },
});
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
