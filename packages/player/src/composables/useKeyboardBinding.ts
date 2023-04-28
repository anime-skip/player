import { Ref } from 'vue';
import {
  KeyboardShortcutAction,
  KeyboardShortcutMap,
} from '../utils/keyboard-shortcut-utils';

/**
 * Returns a writable reference to the current key binding for an action. Works with v-model.
 */
export default function (
  map: Ref<KeyboardShortcutMap | null>,
  action: KeyboardShortcutAction,
) {
  return computed<string | undefined>({
    get() {
      return map.value?.[action];
    },
    set(newBinding) {
      if (!map.value) return;
      map.value = { ...map.value, [action]: newBinding };
    },
  });
}
