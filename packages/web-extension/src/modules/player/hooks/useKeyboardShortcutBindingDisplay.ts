import {
  KeyboardShortcutAction,
  usePrimaryKeyboardShortcutPrefs,
  useSecondaryKeyboardShortcutPrefs,
} from '~/common/state/useKeyboardShortcutPrefs';

export default function useKeyboardShortcutBindingDisplay(action: KeyboardShortcutAction) {
  const { primaryShortcutsActionToKeyMap } = usePrimaryKeyboardShortcutPrefs();
  const { secondaryShortcutsActionToKeyMap } = useSecondaryKeyboardShortcutPrefs();
  return computed<string | undefined>(
    () => primaryShortcutsActionToKeyMap[action] || secondaryShortcutsActionToKeyMap[action]
  );
}
