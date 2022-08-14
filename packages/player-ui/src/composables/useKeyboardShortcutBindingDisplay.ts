import {
  KeyboardShortcutAction,
  usePrimaryKeyboardShortcutPrefs,
  useSecondaryKeyboardShortcutPrefs,
} from '~/stores/useKeyboardShortcutPrefs';

export default function useKeyboardShortcutBindingDisplay(action: KeyboardShortcutAction) {
  const { primaryShortcutsActionToKeyMap } = usePrimaryKeyboardShortcutPrefs();
  const { secondaryShortcutsActionToKeyMap } = useSecondaryKeyboardShortcutPrefs();
  return computed<string | undefined>(
    () =>
      primaryShortcutsActionToKeyMap.value[action] || secondaryShortcutsActionToKeyMap.value[action]
  );
}
