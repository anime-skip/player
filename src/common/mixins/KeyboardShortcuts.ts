import { ACCEPTED_KEYS } from '../utils/Constants';
import { Vue, Component } from 'vue-property-decorator';
import Utils from '../utils/Utils';

@Component
export default class KeyboardShortcutMixin extends Vue {
  created(): void {
    console.debug(`[${this.$options.name}] KeyboardShortcutMixin.created()`);
    global.addKeyDownListener(this.onKeyDown);
  }

  destroyed(): void {
    global.removeKeyDownListener(this.onKeyDown);
  }

  onKeyDown(event: KeyboardEvent): void {
    // Prevent triggers from firing while typing
    if (document.activeElement?.tagName === 'INPUT' || !Utils.isKeyComboAllowed(event)) {
      return;
    }

    const keyCombo = Utils.keyComboFromEvent(event);
    let keyAction = Utils.findShortcutAction(
      keyCombo,
      this.$store.getters.primaryKeyboardShortcuts
    );
    if (keyAction == null) {
      keyAction = Utils.findShortcutAction(
        keyCombo,
        this.$store.getters.secondaryKeyboardShortcuts
      );
    }

    console.debug(`[${this.$options.name}] Pressed ${keyCombo} -> ${keyAction}`);
    if (keyAction == null || this.keyboardShortcuts[keyAction] == null) return;
    (this.keyboardShortcuts[keyAction] as Function).apply(this);
  }
  keyboardShortcuts: { [action in KeyboardShortcutAction]?: () => void } = {};
}
