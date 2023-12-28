export function forwardKeydownEvent(event: KeyboardEvent) {
  window.dispatchEvent(new KeyboardEvent('anime-skip:keydown', event));
}
