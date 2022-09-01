import { defineStore } from 'pinia';
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

function defineKeyboardShortcutUtils(
  type: 'primary' | 'secondary',
  initialValue: KeyboardShortcutActionToKeyBindingMap
) {
  const actionToKey = usePlayerStorage(`keyboard-shortcut-${type}-action-mapping`, initialValue);

  const keyToAction = computed(() => {
    return Object.keys(actionToKey.value).reduce<KeyboardShortcutKeyBindingToActionsMap>(
      (map, str) => {
        const action = str as KeyboardShortcutAction;
        const keyBinding = actionToKey.value[action];
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

  function setKeyBinding(action: KeyboardShortcutAction, keyBinding: string | undefined) {
    actionToKey.value = { ...toRaw(actionToKey.value), [action]: keyBinding };
  }

  return [actionToKey, keyToAction, setKeyBinding] as const;
}

export const useKeyboardShortcutStore = defineStore('keyboard-shortcuts', () => {
  const [primaryActionToKey, primaryKeyToActions, setPrimaryKeyBinding] =
    defineKeyboardShortcutUtils('primary', DEFAULT_PRIMARY_KEYBOARD_SHORTCUTS);

  const [secondaryActionToKey, secondaryKeyToActions, setSecondaryKeyBinding] =
    defineKeyboardShortcutUtils('secondary', DEFAULT_SECONDARY_KEYBOARD_SHORTCUTS);

  return {
    primaryActionToKey,
    primaryKeyToActions,
    setPrimaryKeyBinding,
    secondaryActionToKey,
    secondaryKeyToActions,
    setSecondaryKeyBinding,
  };
});
