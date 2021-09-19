import { loadedLog } from '~/common/utils/loadedLog';

loadedLog('content-scripts/keyboard-blocker/index.ts');

let keyboardListeners: Array<(event: KeyboardEvent) => void> = [];

window.addKeyDownListener = function (callback) {
  keyboardListeners.push(callback);
};

window.removeKeyDownListener = function (callback) {
  keyboardListeners = keyboardListeners.filter(item => item !== callback);
};

/**
 * Setup a keydown event. This has to be setup before the page we're injecting this onto adds
 * something, so it gets called first. If it doesn't get called first, it can't stop the propagation
 */
document.addEventListener('keydown', function (event) {
  setTimeout(() => {
    console.log('calling keyboard listeners');
    keyboardListeners.forEach(listener => listener(event));
  }, 0);
  event.stopImmediatePropagation();
  event.stopPropagation();
  event.cancelBubble = true;
});
