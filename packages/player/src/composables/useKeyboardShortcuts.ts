import { invertKeyboardShortcutMap } from '../utils/keyboard-shortcut-utils';

/**
 * Return both sets of keyboard shortcts, primary and secondary, in two forms:
 *
 * - `*ActionBindingMap` - writable map of the action to the key binding. Use on
 *   settings page to configure keyboard shortcuts.
 * - `*BindingActionsMap` - Read only map of key presses to the actions they trigger. Used to
 *   decide which action to trigger when pressing keys.
 */
export default createGlobalState(() => {
  const { storage } = usePlayerOptions();
  const { state: primaryKeyboardActionBindingMap } = usePlayerStorage(
    storage.primaryKeyboardShortcuts,
  );
  const primaryKeyboardBindingActionsMap = computed(() =>
    primaryKeyboardActionBindingMap.value
      ? invertKeyboardShortcutMap(primaryKeyboardActionBindingMap.value)
      : {},
  );

  const { state: secondaryKeyboardActionBindingMap } = usePlayerStorage(
    storage.secondaryKeyboardShortcuts,
  );
  const secondaryKeyboardBindingActionsMap = computed(() =>
    secondaryKeyboardActionBindingMap.value
      ? invertKeyboardShortcutMap(secondaryKeyboardActionBindingMap.value)
      : {},
  );

  return {
    primaryKeyboardActionBindingMap,
    primaryKeyboardBindingActionsMap,
    secondaryKeyboardActionBindingMap,
    secondaryKeyboardBindingActionsMap,
  };
});
