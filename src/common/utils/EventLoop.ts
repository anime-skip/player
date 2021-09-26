export function nextTask(): Promise<void> {
  return new Promise(res => setTimeout(res, 0));
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function waitUntil(
  callback: () => Promise<boolean>,
  timeoutMs: number,
  backoffRate = 2,
  initilSleepMs = 10
): Promise<void> {
  let done = false;
  let resolve: () => void;
  const promise = new Promise<void>(res => {
    resolve = res;
  });
  setTimeout(() => {
    if (!done) return;
    done = true;
    resolve();
  }, timeoutMs);

  let sleepMs = initilSleepMs;
  callback().then(async res => {
    done = res;
    if (!done) {
      await nextTask();
    }
    while (!done) {
      done = await callback();
      if (!done) {
        await sleep(sleepMs);
        sleepMs *= backoffRate;
      }
    }
    resolve();
  });

  return promise;
}
