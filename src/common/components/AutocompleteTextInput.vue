<template>
  <div class="AutocompleteTextInput">
    <TextInput
      ref="input"
      :label="label"
      :errorMessage="errorMessage"
      :leftIcon="leftIcon"
      v-model:value="searchValue"
      :disabled="disabled"
      @focus="onFocusInput"
      @blur="onBlurInput"
      @keypress-esc="onPressEsc"
      @keydown.enter.prevent.stop="onSubmit"
      @keydown.up.prevent.stop="selectUp"
      @keydown.down.prevent.stop="selectDown"
    />
    <!-- @mousedown.prevent: prevent input from losing focus when clicking on an item -->
    <div
      v-if="shouldShowSuggestions"
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
import { computed, defineComponent, PropType, ref, watch } from 'vue';
import TextInput from './TextInput.vue';

export default defineComponent({
  components: { TextInput },
  props: {
    value: { type: Object as PropType<AutocompleteItem>, required: true },
    label: String,
    errorMessage: String,
    noOptionsMessage: { type: String, default: 'No results' },
    options: { type: Array as PropType<AutocompleteItem[]>, required: true },
    leftIcon: String,
    searchDelay: { type: Number, default: 300 },
    disabled: Boolean,
  },
  emits: ['search', 'focus', 'blur', 'select', 'update:value'],
  setup(props, { emit }) {
    const searchValue = ref(props.value.title);
    const searchTimeout = ref<number | undefined>(undefined);
    watch(searchValue, newSearchValue => {
      if (searchTimeout.value) {
        clearTimeout(searchTimeout.value);
      }
      if (newSearchValue !== props.value.title) {
        searchTimeout.value = window.setTimeout(
          () => emit('search', newSearchValue.trim()),
          props.searchDelay
        );

        emit('update:value', {
          key: '',
          title: newSearchValue,
        });
      }
    });
    watch(
      () => props.value,
      newValue => {
        searchValue.value = newValue.title;
      }
    );

    const wasEscPressed = ref(false);
    const onPressEsc = (): void => {
      wasEscPressed.value = true;
      (document.activeElement as HTMLElement | undefined)?.blur();
    };

    const highlightedIndex = ref<number | null>(null);
    const moveHighlightedIndex = (increment: 1 | -1) => () => {
      if (highlightedIndex.value === null) {
        highlightedIndex.value = increment === 1 ? 0 : props.options.length - 1;
      } else {
        highlightedIndex.value =
          (highlightedIndex.value + increment + props.options.length) % props.options.length;
      }
    };
    const selectUp = moveHighlightedIndex(-1);
    const selectDown = moveHighlightedIndex(1);
    watch(
      () => props.options,
      newOptions => {
        if (newOptions.length === 1) {
          highlightedIndex.value = 0;
          return;
        }

        const matchingIndex = newOptions.findIndex(option => option.title === searchValue.value);
        highlightedIndex.value = matchingIndex === -1 ? null : matchingIndex;
      }
    );

    const onHoverOptions = (): void => {
      highlightedIndex.value = null;
    };

    const onClickOption = (option: AutocompleteItem): void => {
      emit('update:value', option);
      emit('select');
      onPressEsc();
    };
    const onSubmit = (): void => {
      const highlightedOption = props.options[highlightedIndex.value ?? -1];
      if (highlightedOption != null) {
        onClickOption(highlightedOption);
      }
    };

    const isFocused = ref(false);
    const onFocusInput = (): void => {
      wasEscPressed.value = false;
      isFocused.value = true;
      emit('focus');
      emit('search', searchValue.value);
    };
    const onBlurInput = (): void => {
      wasEscPressed.value = false;
      isFocused.value = false;
      emit('blur');
    };

    const shouldShowSuggestions = computed<boolean>(() => {
      return !wasEscPressed.value && isFocused.value;
    });

    return {
      searchValue,

      wasEscPressed,
      onPressEsc,

      isFocused,
      onFocusInput,
      onBlurInput,

      shouldShowSuggestions,
      highlightedIndex,
      selectUp,
      selectDown,

      onHoverOptions,

      onClickOption,
      onSubmit,
    };
  },
  methods: {
    focus() {
      (this.$refs.input as any | undefined)?.focus(true);
    },
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
