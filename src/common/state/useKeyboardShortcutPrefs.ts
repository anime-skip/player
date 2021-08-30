import { useWebExtensionStorage } from '../hooks/useWebExtensionStorage';
import {
  DEFAULT_PRIMARY_KEYBOARD_SHORTCUTS,
  DEFAULT_SECONDARY_KEYBOARD_SHORTCUTS,
} from '../utils/Constants';

export type KeyboardShortcutAction =
  | 'playPause'
  | 'toggleFullscreen'
  | 'volumeUp'
  | 'volumeDown'
  | 'hideDialog'
  | 'nextTimestamp'
  | 'previousTimestamp'
  | 'advanceFrame'
  | 'advanceSmall'
  | 'advanceMedium'
  | 'advanceLarge'
  | 'rewindFrame'
  | 'rewindSmall'
  | 'rewindMedium'
  | 'rewindLarge'
  | 'createTimestamp'
  | 'saveTimestamps'
  | 'discardChanges'
  | 'takeScreenshot';

export type KeyboardShortcutActionToKeyBindingMap = {
  [action in KeyboardShortcutAction]?: string;
};
export type KeyboardShortcutActionToExecuteMap = {
  [action in KeyboardShortcutAction]?: () => void;
};
export type KeyboardShortcutKeyBindingToActionsMap = {
  [keyBinding: string]: KeyboardShortcutAction[] | undefined;
};

export function createUseKeyboardShortcutPrefs(
  type: 'primary' | 'secondary',
  initialValue: KeyboardShortcutActionToKeyBindingMap
) {
  return () => {
    const { value: shortcutsActionToKeyMap, updateValue: updateShortcutsActionToKeyMap } =
      useWebExtensionStorage(`keyboard-shortcut-${type}-action-mapping`, initialValue, 'local'); // TODO: Use sync here, or put them in the API

    const shortcutsKeyToActionsMap = computed(() => {
      return Object.keys(shortcutsActionToKeyMap).reduce<KeyboardShortcutKeyBindingToActionsMap>(
        (map, str) => {
          const action = str as KeyboardShortcutAction;
          const keyBinding = shortcutsActionToKeyMap[action];
          if (keyBinding) {
            if (map[keyBinding] != null) {
              map[keyBinding]?.push(action);
            } else {
              map[keyBinding] = [action];
            }
          }
          return map;
        },
        {}
      );
    });

    return {
      shortcutsActionToKeyMap,
      shortcutsKeyToActionsMap,
      updateShortcutsActionToKeyMap,
    };
  };
}

const usePrimaryKeyboardShortcutPrefsUgly = createUseKeyboardShortcutPrefs(
  'primary',
  DEFAULT_PRIMARY_KEYBOARD_SHORTCUTS
);

const useSecondaryKeyboardShortcutPrefsUgly = createUseKeyboardShortcutPrefs(
  'secondary',
  DEFAULT_SECONDARY_KEYBOARD_SHORTCUTS
);

export function usePrimaryKeyboardShortcutPrefs() {
  const hook = usePrimaryKeyboardShortcutPrefsUgly();
  return {
    primaryShortcutsActionToKeyMap: hook.shortcutsActionToKeyMap,
    primaryShortcutsKeyToActionsMap: hook.shortcutsKeyToActionsMap,
    updatePrimaryShortcutsActionToKeyMap: hook.updateShortcutsActionToKeyMap,
  };
}

export function useSecondaryKeyboardShortcutPrefs() {
  const hook = useSecondaryKeyboardShortcutPrefsUgly();
  return {
    secondaryShortcutsActionToKeyMap: hook.shortcutsActionToKeyMap,
    secondaryShortcutsKeyToActionsMap: hook.shortcutsKeyToActionsMap,
    updateSecondaryShortcutsActionToKeyMap: hook.updateShortcutsActionToKeyMap,
  };
}

export function useUpdatePrimaryKeyBinding() {
  const { updatePrimaryShortcutsActionToKeyMap } = usePrimaryKeyboardShortcutPrefs();
  return (action: KeyboardShortcutAction) => (keyBinding: string | null) => {
    // TODO: Make API call
    updatePrimaryShortcutsActionToKeyMap({ [action]: keyBinding });
  };
}

export function useUpdateSecondaryKeyBinding() {
  const { updateSecondaryShortcutsActionToKeyMap } = useSecondaryKeyboardShortcutPrefs();
  return (action: KeyboardShortcutAction) => (keyBinding: string | null) => {
    // TODO: Make API call
    updateSecondaryShortcutsActionToKeyMap({ [action]: keyBinding });
  };
}
