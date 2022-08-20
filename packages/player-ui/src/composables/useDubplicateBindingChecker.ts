import { Ref } from 'vue';
import { createSharedComposable } from '../composables/createSharedComposable';
import {
  usePrimaryKeyboardShortcutPrefs,
  useSecondaryKeyboardShortcutPrefs,
} from '../stores/useKeyboardShortcutPrefs';

export const useDuplicateBindingChecker = createSharedComposable(() => {
  const { primaryShortcutsKeyToActionsMap } = usePrimaryKeyboardShortcutPrefs();
  const { secondaryShortcutsKeyToActionsMap } = useSecondaryKeyboardShortcutPrefs();

  return function checkDuplicateBinding(binding: Ref<string | undefined>) {
    return computed(() => {
      const key = binding.value ?? '';
      const primaryUsedCount = primaryShortcutsKeyToActionsMap.value[key]?.length ?? 0;
      const secondaryUsedCount = secondaryShortcutsKeyToActionsMap.value[key]?.length ?? 0;
      return primaryUsedCount + secondaryUsedCount > 1;
    });
  };
});
