import { ACCEPTED_KEYS } from '../utils/Constants';
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class KeyboardShortcutMixin extends Vue {
  created(): void {
    console.log('KeyboardShortcutMixin.created()');
    // document.onkeydown = null;
    document.addEventListener('keydown', this.onKeyDown);
  }

  destroyed(): void {
    document.removeEventListener('keydown', this.onKeyDown);
  }

  onKeyDown({
    keyCode,
    ctrlKey,
    preventDefault,
    stopImmediatePropagation,
    stopPropagation,
  }: KeyboardEvent): void {
    console.log('KeyboardShortcutMixin: key down ', {
      keyCode,
      ctrlKey,
      preventDefault,
      stopImmediatePropagation,
      stopPropagation,
      activeTag: document.activeElement?.tagName,
    });
    // Prevent triggers from firing while typing
    if (document.activeElement?.tagName === 'INPUT') {
      return;
    }

    const key = ACCEPTED_KEYS[keyCode];
    if (!key) return;

    const combination = ctrlKey ? 'ctrl+' + key : key;
    console.log('KeyboardShortcutMixin: Pressed ' + combination, this.keyboardShortcuts);
    if (this.keyboardShortcuts[combination] == null) return;
    const allowEventToPropagate = (this.keyboardShortcuts[combination] as Function).apply(this);

    // Stop if it finds a function to run, and that function doesn't return true
    if (allowEventToPropagate) {
      preventDefault();
      stopImmediatePropagation();
      stopPropagation();
    }
  }
  keyboardShortcuts: { [combination: string]: () => boolean | void } = {};
}
