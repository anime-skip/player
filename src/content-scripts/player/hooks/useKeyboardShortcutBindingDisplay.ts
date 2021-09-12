import {
  KeyboardShortcutAction,
  usePrimaryKeyboardShortcutPrefs,
  useSecondaryKeyboardShortcutPrefs,
} from '~/common/state/useKeyboardShortcutPrefs';

export default function useKeyboardShortcutBindingDisplay(action: KeyboardShortcutAction) {
  const { primaryShortcutsActionToKeyMap } = usePrimaryKeyboardShortcutPrefs();
  const { secondaryShortcutsActionToKeyMap } = useSecondaryKeyboardShortcutPrefs();
  console.log(
    JSON.parse(
      JSON.stringify({
        pm: primaryShortcutsActionToKeyMap,
        sm: secondaryShortcutsActionToKeyMap,
        p: primaryShortcutsActionToKeyMap[action],
        s: secondaryShortcutsActionToKeyMap[action],
      })
    )
  );
  return computed<string | undefined>(
    () => primaryShortcutsActionToKeyMap[action] || secondaryShortcutsActionToKeyMap[action]
  );
}
