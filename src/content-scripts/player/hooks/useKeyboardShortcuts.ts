import { onUnmounted } from 'vue';
import {
  KeyboardShortcutActionToExecuteMap,
  usePrimaryKeyboardShortcutPrefs,
  useSecondaryKeyboardShortcutPrefs,
} from '~/common/state/useKeyboardShortcutPrefs';
import Utils from '~/common/utils/Utils';

// TODO: make sure new keyboard shortcut optimizations work
export function useKeyboardShortcuts(
  componentName: string,
  shortcuts: KeyboardShortcutActionToExecuteMap
) {
  console.debug(`[${componentName}] useKeyboardShortcuts()`);

  const { primaryShortcutsKeyToActionsMap } = usePrimaryKeyboardShortcutPrefs();
  const { secondaryShortcutsKeyToActionsMap } = useSecondaryKeyboardShortcutPrefs();

  const onKeyDownInstance = (event: KeyboardEvent) => {
    // Prevent triggers from firing while typing
    if (document.activeElement?.tagName === 'INPUT' || !Utils.isKeyComboAllowed(event)) {
      return;
    }

    const keyCombo = Utils.keyComboFromEvent(event);
    const keyActions = [
      ...(primaryShortcutsKeyToActionsMap.value[keyCombo] ?? []),
      ...(secondaryShortcutsKeyToActionsMap.value[keyCombo] ?? []),
    ];

    console.debug(`[${componentName}] Pressed ${keyCombo} -> [${keyActions.join(', ')}]`);
    keyActions.forEach(action => shortcuts[action]?.());
  };

  window.addKeyDownListener(onKeyDownInstance);
  onUnmounted(() => window.removeKeyDownListener(onKeyDownInstance));

  return shortcuts;
}
