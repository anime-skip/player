<template>
  <div class="relative flex flex-col">
    <TextInput
      ref="input"
      class="relative"
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
    <div v-if="shouldShowSuggestions" class="h-0 overflow-y-visible z-10">
      <!-- @mousedown.prevent: prevent input from losing focus when clicking on an item -->
      <Card
        class="
          max-h-72
          mt-1
          rounded
          divide-y divide-on-surface divide-opacity-divider
          overflow-auto
        "
        :elevation="4"
        @mousedown.prevent
        @mouseover="onHoverOptions"
      >
        <div v-for="(option, index) of options" :key="option.key">
          <div
            class="option clickable"
            :class="{ highlighted: index === highlightedIndex }"
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
              <p class="subtitle-1 text-on-surface text-opacity-high">{{ option.title }}</p>
              <p v-if="option.subtitle" class="subtitle-2 text-on-surface text-opacity-medium mt-1">
                {{ option.subtitle }}
              </p>
            </slot>
          </div>
        </div>
        <p
          v-if="options.length === 0 && !!searchValue"
          class="option text-opacity-medium text-center"
        >
          {{ noOptionsMessage }}
        </p>
      </Card>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref, watch } from 'vue';

export default defineComponent({
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
      (this.$refs.input as TextInputRef | undefined)?.focus(true);
    },
  },
});
</script>

<style lang="css">
.surface-control {
  --surface-color: theme('colors.control') !important;
}

.min-h-12 {
  min-height: 3rem;
}

.option {
  @apply flex flex-col justify-center px-4 py-2;
  min-height: 48px;
}
.option.clickable {
  @apply bg-on-surface bg-opacity-0 transition-colors hover:bg-opacity-divider cursor-pointer;
}
.option.highlighted {
  @apply bg-opacity-divider !important;
}
</style>
