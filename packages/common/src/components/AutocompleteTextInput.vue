<template>
  <div class="as-relative as-flex as-flex-col">
    <text-input
      ref="input"
      class="as-relative"
      :label="label"
      :placeholder="placeholder"
      :error-message="errorMessage"
      :left-icon="leftIcon"
      v-model:value="searchValue"
      :disabled="disabled"
      @focus="onFocusInput"
      @blur="onBlurInput"
      @keypress-esc="onPressEsc"
      @keydown.enter.prevent.stop="onSubmit"
      @keydown.up.prevent.stop="selectUp"
      @keydown.down.prevent.stop="selectDown"
      @click.prevent.stop
    />
    <div v-if="shouldShowSuggestions" class="as-h-0 as-overflow-y-visible as-z-10">
      <!-- @mousedown.prevent: prevent input from losing focus when clicking on an item -->
      <card
        class="as-max-h-72 as-mt-1 as-rounded as-divide-y as-divide-on-surface as-divide-opacity-divider as-overflow-auto"
        :elevation="4"
        @mousedown.prevent
        @mouseover="onHoverOptions"
      >
        <div v-for="(option, index) of options" :key="option.key">
          <div
            class="as-option as-clickable"
            :class="{ 'as-highlighted': index === highlightedIndex }"
            @click="onClickOption(option)"
          >
            <slot
              name="option"
              :option="option"
              :index="index"
              :highlightedIndex="highlightedIndex"
              :value="value"
              :click="onClickOption"
            >
              <p class="as-subtitle-1 as-text-on-surface as-text-opacity-high">
                {{ option.title }}
              </p>
              <p
                v-if="option.subtitle"
                class="as-subtitle-2 as-text-on-surface as-text-opacity-medium as-mt-1"
              >
                {{ option.subtitle }}
              </p>
            </slot>
          </div>
        </div>
        <p
          v-if="options.length === 0 && !!searchValue"
          class="as-option as-text-opacity-medium as-text-center"
        >
          {{ noOptionsMessage }}
        </p>
      </card>
    </div>
  </div>
</template>

<script lang="ts">
import { Card, TextInput } from '@anime-skip/ui';
import { computed, defineComponent, PropType, ref, watch } from 'vue';

export default defineComponent({
  components: {
    Card,
    TextInput,
  },
  props: {
    value: { type: Object as PropType<AutocompleteItem>, required: true },
    label: { type: String, default: undefined },
    placeholder: { type: String, default: undefined },
    errorMessage: { type: String, default: undefined },
    noOptionsMessage: { type: String, default: 'No results' },
    options: { type: Array as PropType<AutocompleteItem[]>, required: true },
    leftIcon: { type: String, default: undefined },
    searchDelay: { type: Number, default: 300 },
    disabled: Boolean,
  },
  emits: {
    search: (_searchValue: string) => true,
    focus: () => true,
    blur: () => true,
    select: () => true,
    'update:value': (_newValue: AutocompleteItem) => true,
  },
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
      onPressEsc();
      emit('select');
    };
    const selectHighlightedItem = () => {
      const highlightedOption = props.options[highlightedIndex.value ?? -1];
      if (highlightedOption != null) {
        onClickOption(highlightedOption);
      }
    };
    const onSubmit = (): void => {
      selectHighlightedItem();
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

      onPressEsc,

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
      (this.$refs.input as TextInputRef | undefined)?.focus(true);
    },
  },
});
</script>

<style>
.as-option {
  @apply as-flex as-flex-col as-justify-center as-px-4 as-py-2;
  min-height: 48px;
}
.as-option.as-clickable {
  @apply as-bg-on-surface as-bg-opacity-0 as-transition-colors hover:as-bg-opacity-divider as-cursor-pointer;
}
.as-option.as-highlighted {
  @apply as-bg-opacity-divider !important;
}
</style>
