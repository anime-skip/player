/**
 * The list of actions available for keyboard shortcuts.
 */
export type KeyboardShortcutAction =
  | 'playPause'
  | 'toggleFullscreen'
  | 'volumeUp'
  | 'volumeDown'
  | 'hideDialog'
  | 'nextTimestamp'
  | 'previousTimestamp'
  | 'advanceFrame'
  | 'advanceSmall'
  | 'advanceMedium'
  | 'advanceLarge'
  | 'rewindFrame'
  | 'rewindSmall'
  | 'rewindMedium'
  | 'rewindLarge'
  | 'createTimestamp'
  | 'saveTimestamps'
  | 'discardChanges'
  | 'playbackRateDown'
  | 'playbackRateUp';

export type KeyboardShortcutMap = Record<
  KeyboardShortcutAction,
  string | undefined
>;
export type KeyboardShortcutInvertedMap = Record<
  string,
  [KeyboardShortcutAction, ...KeyboardShortcutAction[]] | undefined
>;

export const DEFAULT_PRIMARY_KEYBOARD_SHORTCUTS: KeyboardShortcutMap = {
  playPause: 'D',
  toggleFullscreen: 'G',
  volumeUp: '↑',
  volumeDown: '↓',
  playbackRateUp: 'shift+↑',
  playbackRateDown: 'shift+↓',
  discardChanges: 'ctrl+`',
  hideDialog: '`',
  nextTimestamp: 'shift+L',
  previousTimestamp: 'shift+J',
  advanceFrame: 'L',
  advanceSmall: 'V',
  advanceMedium: 'F',
  advanceLarge: 'R',
  rewindFrame: 'J',
  rewindSmall: 'X',
  rewindMedium: 'S',
  rewindLarge: 'W',
  createTimestamp: 'K',
  saveTimestamps: 'ctrl+ENTER',
};

export const DEFAULT_SECONDARY_KEYBOARD_SHORTCUTS: KeyboardShortcutMap = {
  playPause: 'Space',
  toggleFullscreen: undefined,
  volumeUp: undefined,
  volumeDown: undefined,
  playbackRateUp: undefined,
  playbackRateDown: undefined,
  discardChanges: undefined,
  hideDialog: undefined,
  nextTimestamp: 'shift+→',
  previousTimestamp: 'shift+←',
  advanceFrame: undefined,
  advanceSmall: undefined,
  advanceMedium: '→',
  advanceLarge: undefined,
  rewindFrame: undefined,
  rewindSmall: undefined,
  rewindMedium: '←',
  rewindLarge: undefined,
  createTimestamp: undefined,
  saveTimestamps: undefined,
};

/**
 * Convert a map of (action->shortcut) to a map of (shortcut->action[])
 */
export function invertKeyboardShortcutMap(
  map: KeyboardShortcutMap,
): KeyboardShortcutInvertedMap {
  return (
    Object.entries(map) as Array<[KeyboardShortcutAction, string | undefined]>
  ).reduce<KeyboardShortcutInvertedMap>((map, [action, shortcut]) => {
    if (!shortcut) return map;

    if (!map[shortcut]) map[shortcut] = [action];
    else map[shortcut]!.push(action);

    return map;
  }, {});
}

export function isModiferKeyPressed(event: KeyboardEvent) {
  return event.ctrlKey || event.altKey || event.shiftKey || event.metaKey;
}

export function isKeyComboAllowed(event: KeyboardEvent) {
  const isModifierPressed = isModiferKeyPressed(event);
  switch (event.key) {
    case 'Enter':
    case 'Backspace':
    case 'Escape':
      return isModifierPressed;
    case 'Control':
    case 'Alt':
    case 'Shift':
    case 'Meta':
    case 'PageUp':
    case 'PageDown':
    case 'Home':
    case 'End':
    case 'Insert':
    case 'Delete':
    case 'Tab':
    case 'Pause':
    case 'NumLock':
    case 'CapsLock':
    case 'ScrollLock':
    case 'ContextMenu':
      return false;
  }
  return true;
}

export function keyComboFromEvent(event: KeyboardEvent) {
  let key = event.key;
  if (key === ' ') key = 'Space';
  else if (key === 'ArrowRight') key = '→';
  else if (key === 'ArrowLeft') key = '←';
  else if (key === 'ArrowUp') key = '↑';
  else if (key === 'ArrowDown') key = '↓';
  else key = key.toUpperCase();

  if (event.ctrlKey) key = `ctrl+${key}`;
  if (event.altKey) key = `alt+${key}`;
  if (event.shiftKey) key = `shift+${key}`;
  if (event.metaKey) key = `meta+${key}`;
  return key;
}
