export function nextTask(): Promise<void> {
  return new Promise(res => setTimeout(res, 0));
}

export function nextFrame(): Promise<void> {
  return new Promise(res => requestAnimationFrame(() => res()));
}
