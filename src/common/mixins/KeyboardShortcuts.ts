import { defineComponent } from 'vue';
import { GetterTypes } from '../store/getterTypes';
import Utils from '../utils/Utils';

export type KeyboardShortcutMap = { [action in KeyboardShortcutAction]?: () => void };
interface Data {
  $keyboardShortcuts: KeyboardShortcutMap;
}

export default defineComponent({
  created() {
    this.$keyboardShortcuts = this.setupKeyboardShortcuts();
    global.addKeyDownListener(this.onKeyDown);
    console.debug(`[${this.$options.name}] KeyboardShortcutMixin.created()`);
  },
  destroyed(): void {
    global.removeKeyDownListener(this.onKeyDown);
  },
  data(): Data {
    // @ts-ignore: Data is just for the typing, shortcuts are setup in created
    return {};
  },
  methods: {
    onKeyDown(event: KeyboardEvent): void {
      // Prevent triggers from firing while typing
      if (document.activeElement?.tagName === 'INPUT' || !Utils.isKeyComboAllowed(event)) {
        return;
      }

      const keyCombo = Utils.keyComboFromEvent(event);
      let keyAction = Utils.findShortcutAction(
        keyCombo,
        this.$store.getters[GetterTypes.PRIMARY_KEYBOARD_SHORTCUTS]
      );
      if (keyAction == null) {
        keyAction = Utils.findShortcutAction(
          keyCombo,
          this.$store.getters[GetterTypes.SECONDARY_KEYBOARD_SHORTCUTS]
        );
      }

      console.debug(`[${this.$options.name}] Pressed ${keyCombo} -> ${keyAction}`);
      if (keyAction == null || this.$keyboardShortcuts[keyAction] == null) return;
      (this.$keyboardShortcuts[keyAction] as Function).apply(this);
    },
    setupKeyboardShortcuts(): { [action in KeyboardShortcutAction]?: () => void } {
      return {};
    },
  },
});
