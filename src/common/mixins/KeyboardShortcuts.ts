import VideoUtils from '../../player/VideoUtils';

const keys: { [keyCode: number]: string } = {
  38: 'UP',
  40: 'DOWN',
  37: 'LEFT',
  39: 'RIGHT',
  32: 'SPACE',
  81: 'Q',
  87: 'W',
  69: 'E',
  65: 'A',
  83: 'S',
  68: 'D',
  90: 'Z',
  88: 'X',
  67: 'C',
  219: '[',
  221: ']',
};

const functionMapping: { [combination: string]: () => void } = {
  // Advance Time
  ']': () => VideoUtils.addTime(1 / 24),
  C: () => VideoUtils.addTime(2),
  RIGHT: () => VideoUtils.addTime(5),
  D: () => VideoUtils.addTime(5),
  E: () => VideoUtils.addTime(85),
  // Rewind Time
  '[': () => VideoUtils.addTime(-1 / 24),
  Z: () => VideoUtils.addTime(-2),
  LEFT: () => VideoUtils.addTime(-5),
  A: () => VideoUtils.addTime(-5),
  Q: () => VideoUtils.addTime(-85),
  // Next Timestamp
  'ctrl+RIGHT': () => VideoUtils.nextTimestamp(),
  W: () => VideoUtils.nextTimestamp(),
  // Previous Timestamp
  'ctrl+LEFT': () => VideoUtils.previousTimestamp(),
  X: () => VideoUtils.previousTimestamp(),
  // Play/Pause
  SPACE: () => VideoUtils.togglePlayPause(),
  S: () => VideoUtils.togglePlayPause(),
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
  created: function(): void {
    document.onkeydown = onKeyDown;
  },
  destroyed: function(): void {
    document.onkeydown = () => {};
  },
};
export default KeyboardShortcutMixin;
