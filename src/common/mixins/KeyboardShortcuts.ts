import VideoUtils from '../../player/VideoUtils';

const keys: { [keyCode: number]: string } = {
  13: 'ENTER',
  32: 'SPACE',
  37: 'LEFT',
  38: 'UP',
  39: 'RIGHT',
  40: 'DOWN',
  65: 'A',
  67: 'C',
  68: 'D',
  69: 'E',
  70: 'F',
  73: 'I',
  74: 'J',
  75: 'K',
  76: 'L',
  77: 'M',
  79: 'O',
  81: 'Q',
  82: 'R',
  83: 'S',
  86: 'V',
  87: 'W',
  88: 'X',
  90: 'Z',
  188: ',',
  219: '[',
  221: ']',
};

const functionMapping: { [combination: string]: () => void } = {
  // Advance Time
  L: () => VideoUtils.addTime(1 / 24),
  V: () => VideoUtils.addTime(2),
  F: () => VideoUtils.addTime(5),
  R: () => VideoUtils.addTime(85),
  E: () => VideoUtils.nextTimestamp(),

  // Rewind Time
  J: () => VideoUtils.addTime(-1 / 24),
  X: () => VideoUtils.addTime(-2),
  S: () => VideoUtils.addTime(-5),
  W: () => VideoUtils.addTime(-85),
  C: () => VideoUtils.previousTimestamp(),

  // General Controls
  D: () => VideoUtils.togglePlayPause(),
};

function onKeyDown({ keyCode, ctrlKey }: KeyboardEvent): void {
  // Preventy triggers during typing
  if (document.activeElement?.tagName === 'INPUT') {
    return;
  }

  const key = keys[keyCode];
  if (!key) return;

  const combination = (ctrlKey ? 'ctrl+' : '') + key;
  const fn = functionMapping[combination];
  if (!fn) return;

  fn();
}

const KeyboardShortcutMixin = {
  created(): void {
    document.onkeydown = onKeyDown;
  },
  destroyed(): void {
    document.onkeydown = () => {};
  },
};
export default KeyboardShortcutMixin;
