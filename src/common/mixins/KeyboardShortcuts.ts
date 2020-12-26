import { defineComponent, onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import { Store } from '../store';
import { GetterTypes } from '../store/getterTypes';
import Utils from '../utils/Utils';

export type KeyboardShortcutMap = { [action in KeyboardShortcutAction]?: () => void };
interface Data {
  $keyboardShortcuts: KeyboardShortcutMap;
}

function onKeyDown(
  this: any,
  componentName: string | undefined,
  $keyboardShortcuts: KeyboardShortcutMap,
  store: Store
) {
  return (event: KeyboardEvent) => {
    // Prevent triggers from firing while typing
    if (document.activeElement?.tagName === 'INPUT' || !Utils.isKeyComboAllowed(event)) {
      return;
    }

    const keyCombo = Utils.keyComboFromEvent(event);
    let keyAction = Utils.findShortcutAction(
      keyCombo,
      store.getters[GetterTypes.PRIMARY_KEYBOARD_SHORTCUTS]
    );
    if (keyAction == null) {
      keyAction = Utils.findShortcutAction(
        keyCombo,
        store.getters[GetterTypes.SECONDARY_KEYBOARD_SHORTCUTS]
      );
    }

    console.debug(`[${componentName}] Pressed ${keyCombo} -> ${keyAction}`);
    if (keyAction == null || $keyboardShortcuts[keyAction] == null) return;
    ($keyboardShortcuts[keyAction] as Function)();
  };
}

export default defineComponent({
  mounted() {
    this.$keyboardShortcuts = this.setupKeyboardShortcuts();
    global.addKeyDownListener(this.onKeyDown);
    console.debug(`[${this.$options.name}] KeyboardShortcutMixin.created()`);
  },
  unmounted(): void {
    global.removeKeyDownListener(this.onKeyDown);
  },
  data(): Data {
    // @ts-ignore: Data is just for the typing, shortcuts are setup in created
    return {};
  },
  methods: {
    onKeyDown(event: KeyboardEvent) {
      onKeyDown(this.$options.name, this.$keyboardShortcuts, this.$store)(event);
    },
    setupKeyboardShortcuts(): { [action in KeyboardShortcutAction]?: () => void } {
      return {};
    },
  },
});

export const useKeyboardShortcuts = (
  componentName: string,
  store: Store = useStore(),
  $keyboardShortcuts: KeyboardShortcutMap = {}
) => {
  const onKeyDownInstance = onKeyDown(componentName, $keyboardShortcuts, store);
  onMounted(() => {
    global.addKeyDownListener(onKeyDownInstance);
    console.debug(`[${componentName}] KeyboardShortcutComposition.created()`);
  });
  onUnmounted(() => {
    global.removeKeyDownListener(onKeyDownInstance);
  });

  return {
    $keyboardShortcuts,
  };
};
