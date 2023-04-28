import { Ref } from 'vue';
import { KeyboardShortcutInvertedMap } from '../utils/keyboard-shortcut-utils';

export default function (
  bindingMap: Ref<KeyboardShortcutInvertedMap>,
  currentBinding: Ref<string | undefined>,
) {
  return computed(() => {
    if (!currentBinding.value) return false;
    const actions = bindingMap.value[currentBinding.value];
    if (!actions) return false;

    return actions.length > 1;
  });
}
