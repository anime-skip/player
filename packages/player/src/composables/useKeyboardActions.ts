import { KeyboardShortcutAction } from '../utils/keyboard-shortcut-utils';
import { keyComboFromEvent } from '../utils/keyboard-shortcut-utils';
import { bounded } from '../utils/math-utils';

/**
 * Registers key press event listeners and performs the actions for a keyboard shortcut if used.
 */
export default createSharedComposable(() => {
  const {
    primaryKeyboardBindingActionsMap,
    secondaryKeyboardBindingActionsMap,
  } = useKeyboardShortcuts();

  const { duration, currentTime, playing, volume } = useVideoControls();
  const view = useView();

  const advance = (s: number) => {
    currentTime.value = bounded(currentTime.value + s, 0, duration.value ?? 0);
  };
  const raiseVolume = (diff: number) => {
    volume.value = bounded(volume.value + diff, 0, 1);
  };
  const { pref: playbackRate } = usePreference('playbackRate', true);
  const increasePlaybackRate = (diff: number) => {
    if (!playbackRate.value) return;

    playbackRate.value = bounded(playbackRate.value + diff, 0.25, 4);
  };
  const { toggle: toggleFullscreen } = usePlayerFullscreen();
  const goToNext = useGoToNext();
  const goToPrevious = useGoToPrevious();

  const actionFns: Record<KeyboardShortcutAction, () => void> = {
    playPause: () => {
      playing.value = !playing.value;
    },

    advanceFrame: () => advance(1 / 24),
    advanceSmall: () => advance(2),
    advanceMedium: () => advance(5),
    advanceLarge: () => advance(90),

    rewindFrame: () => advance(-1 / 24),
    rewindSmall: () => advance(-2),
    rewindMedium: () => advance(-5),
    rewindLarge: () => advance(-90),

    volumeUp: () => raiseVolume(0.1),
    volumeDown: () => raiseVolume(-0.1),

    playbackRateUp: () => increasePlaybackRate(0.25),
    playbackRateDown: () => increasePlaybackRate(-0.25),

    toggleFullscreen,

    hideDialog: () => {
      view.value = undefined;
    },

    nextTimestamp: goToNext,
    previousTimestamp: goToPrevious,

    createTimestamp: () => {},
    discardChanges: () => {},
    saveTimestamps: () => {},
  };

  useEventListener(window, 'keydown', (event) => {
    const binding = keyComboFromEvent(event);
    const actions = [
      ...(primaryKeyboardBindingActionsMap.value[binding] ?? []),
      ...(secondaryKeyboardBindingActionsMap.value[binding] ?? []),
    ];
    if (actions.length > 0) {
      actions.forEach((action) => actionFns[action]?.());
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
    }
  });
});
