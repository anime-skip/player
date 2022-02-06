import { nextTask } from './event-loop';

export const SECOND = 1000;
export const MINUTE = 60 * SECOND;
export const HOUR = 60 * MINUTE;
export const DAY = 24 * HOUR;

export function SECONDS(count: number): number {
  return SECOND * count;
}
export function MINUTES(count: number): number {
  return MINUTE * count;
}
export function HOURS(count: number): number {
  return HOUR * count;
}
export function DAYS(count: number): number {
  return DAY * count;
}

export function today(): number {
  const date = new Date();
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date.getTime();
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
