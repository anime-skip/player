import { storeToRefs } from 'pinia';
import {
  KeyboardShortcutAction,
  useKeyboardShortcutStore,
} from '../stores/useKeyboardShortcutStore';

export default function useKeyboardShortcutBindingDisplay(action: KeyboardShortcutAction) {
  const { primaryActionToKey, secondaryActionToKey } = storeToRefs(useKeyboardShortcutStore());
  return computed<string | undefined>(
    () => primaryActionToKey.value[action] || secondaryActionToKey.value[action]
  );
}
