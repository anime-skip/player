import { usePlayerStorage } from '../composables/usePlayerStorage';
import {
  DEFAULT_PRIMARY_KEYBOARD_SHORTCUTS,
  DEFAULT_SECONDARY_KEYBOARD_SHORTCUTS,
} from '../utils/constants';

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
  | 'discardChanges';

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
    const shortcutsActionToKeyMap = usePlayerStorage(
      `keyboard-shortcut-${type}-action-mapping`,
      initialValue
    );

    const shortcutsKeyToActionsMap = computed(() => {
      return Object.keys(
        shortcutsActionToKeyMap.value
      ).reduce<KeyboardShortcutKeyBindingToActionsMap>((map, str) => {
        const action = str as KeyboardShortcutAction;
        const keyBinding = shortcutsActionToKeyMap.value[action];
        if (keyBinding) {
          if (map[keyBinding] != null) {
            map[keyBinding]?.push(action);
          } else {
            map[keyBinding] = [action];
          }
        }
        return map;
      }, {});
    });

    return {
      shortcutsActionToKeyMap,
      shortcutsKeyToActionsMap,
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
  };
}

export function useSecondaryKeyboardShortcutPrefs() {
  const hook = useSecondaryKeyboardShortcutPrefsUgly();
  return {
    secondaryShortcutsActionToKeyMap: hook.shortcutsActionToKeyMap,
    secondaryShortcutsKeyToActionsMap: hook.shortcutsKeyToActionsMap,
  };
}
