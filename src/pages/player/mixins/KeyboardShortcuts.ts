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
  ']': () => video.addTime(1 / 24),
  C: () => video.addTime(2),
  RIGHT: () => video.addTime(5),
  D: () => video.addTime(5),
  E: () => video.addTime(85),
  // Rewind Time
  '[': () => video.addTime(-1 / 24),
  Z: () => video.addTime(-2),
  LEFT: () => video.addTime(-5),
  A: () => video.addTime(-5),
  Q: () => video.addTime(-85),
  // Next Timestamp
  'ctrl+RIGHT': () => video.nextTimestamp(),
  W: () => video.nextTimestamp(),
  // Previous Timestamp
  'ctrl+LEFT': () => video.previousTimestamp(),
  X: () => video.previousTimestamp(),
  // Play/Pause
  SPACE: () => video.togglePlayPause(),
  S: () => video.togglePlayPause(),
};

function onKeyDown({ keyCode, ctrlKey }: KeyboardEvent): void {
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
