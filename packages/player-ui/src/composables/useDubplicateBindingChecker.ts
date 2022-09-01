import { storeToRefs } from 'pinia';
import { Ref } from 'vue';
import { createSharedComposable } from '../composables/createSharedComposable';
import { useKeyboardShortcutStore } from '../stores/useKeyboardShortcutStore';

export const useDuplicateBindingChecker = createSharedComposable(() => {
  const { primaryKeyToActions, secondaryKeyToActions } = storeToRefs(useKeyboardShortcutStore());

  return function checkDuplicateBinding(binding: Ref<string | undefined>) {
    return computed(() => {
      const key = binding.value ?? '';
      const primaryUsedCount = primaryKeyToActions.value[key]?.length ?? 0;
      const secondaryUsedCount = secondaryKeyToActions.value[key]?.length ?? 0;
      return primaryUsedCount + secondaryUsedCount > 1;
    });
  };
});
