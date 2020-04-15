import { ACCEPTED_KEYS } from '../utils/Constants';
import { Vue, Component } from 'vue-property-decorator';

// const functionMapping: { [combination: string]: () => void } = {
//   // Advance Time
//   L: () => VideoUtils.addTime(1 / 24),
//   V: () => VideoUtils.addTime(2),
//   F: () => VideoUtils.addTime(5),
//   R: () => VideoUtils.addTime(85),
//   E: () => VideoUtils.nextTimestamp(),

//   // Rewind Time
//   J: () => VideoUtils.addTime(-1 / 24),
//   X: () => VideoUtils.addTime(-2),
//   S: () => VideoUtils.addTime(-5),
//   W: () => VideoUtils.addTime(-85),
//   C: () => VideoUtils.previousTimestamp(),

//   // General Controls
//   D: () => VideoUtils.togglePlayPause(),
// };

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
    (this.keyboardShortcuts[combination] as Function).apply(this);

    // Stop if it finds a function to run
    preventDefault();
    stopImmediatePropagation();
    stopPropagation();
  }
  keyboardShortcuts: { [combination: string]: () => void } = {};
}
