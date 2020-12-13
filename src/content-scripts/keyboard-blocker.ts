console.log('INJECTED content-scripts/keyboard-blocker.ts');

/* eslint-disable-next-line no-var */
var keyboardListeners: Array<(event: KeyboardEvent) => void> = [];

global.addKeyDownListener = function (callback) {
  keyboardListeners.push(callback);
};

global.removeKeyDownListener = function (callback) {
  keyboardListeners.filter(item => item !== callback);
};

/**
 * Setup a keydown event. This has to be setup before the page we're injecting this onto adds
 * something, so it gets called first. If it doesn't get called first, it can't stop the propagation
 */
document.addEventListener('keydown', function (event) {
  event.stopImmediatePropagation();
  event.stopPropagation();
  event.cancelBubble = true;
  setImmediate(() => {
    keyboardListeners.forEach(listener => listener(event));
  });
});

// document.addEventListener('keyup', function(event) {
//   event.stopImmediatePropagation();
//   event.stopPropagation();
//   event.cancelBubble = true;
// });
