import { PlayerHosts } from '~/common/utils/compile-time-constants';
import { debug, error, loadedLog } from '~/common/utils/log';
import { urlPatternMatch } from '~/common/utils/strings';

const services: PlayerHosts[] = Object.values(PlayerHosts);

function init() {
  loadedLog('content-scripts/misc/keyboard-shortcut-blocker.ts');

  for (const pattern of services) {
    if (urlPatternMatch(pattern, window.location)) {
      initKeyboardShortcutBlocker();
      return;
    }
  }
}

try {
  init();
} catch (err) {
  error(err);
}

function initKeyboardShortcutBlocker() {
  let keyboardListeners: Array<(event: KeyboardEvent) => void> = [];

  window.addKeyDownListener = callback => {
    keyboardListeners.push(callback);
  };

  window.removeKeyDownListener = callback => {
    keyboardListeners = keyboardListeners.filter(item => item !== callback);
  };

  /**
   * Setup a keydown event. This has to be setup before the page we're injecting this onto adds
   * something, so it gets called first. If it doesn't get called first, it can't stop the propagation
   */
  document.addEventListener('keydown', event => {
    queueMicrotask(() => {
      debug('calling keyboard listeners');
      keyboardListeners.forEach(listener => listener(event));
    });
    event.stopImmediatePropagation();
    event.stopPropagation();
    event.cancelBubble = true;
  });
}
