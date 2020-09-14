import { ACCEPTED_KEYS } from '../utils/Constants';
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class KeyboardShortcutMixin extends Vue {
  created(): void {
    console.log(`[${this.$options.name}] KeyboardShortcutMixin.created()`);
    global.addKeyDownListener(this.onKeyDown);
  }

  destroyed(): void {
    global.removeKeyDownListener(this.onKeyDown);
  }

  onKeyDown(event: KeyboardEvent): void {
    const { keyCode, ctrlKey } = event;
    // Prevent triggers from firing while typing
    if (document.activeElement?.tagName === 'INPUT') {
      return;
    }
    console.log(`[${this.$options.name}] key down`, {
      keyCode,
      activeTag: document.activeElement?.tagName,
    });

    const key = ACCEPTED_KEYS[keyCode];
    if (!key) return;

    const combination = ctrlKey ? 'ctrl+' + key : key;
    console.log(`[${this.$options.name}] Pressed ${combination}`);
    if (this.keyboardShortcuts[combination] == null) return;
    (this.keyboardShortcuts[combination] as Function).apply(this);
  }
  keyboardShortcuts: { [combination: string]: () => void } = {};
}
