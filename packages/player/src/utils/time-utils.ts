import { SECOND } from './time';

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function formatTimestampInS(seconds: number, includeDecimals: boolean) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const secStr = String(Math.floor(secs)).padStart(2, '0');
  if (includeDecimals) {
    let decimal = Math.round((secs - Math.floor(secs)) * 100);
    if (decimal === 100) decimal = 99;
    return `${mins}:${secStr}.${String(decimal).padStart(2, '0')}`;
  } else {
    return `${mins}:${secStr}`;
  }
}

export function formatTimestampInMs(ms: number, includeDecimals: boolean) {
  return formatTimestampInS(ms / SECOND, includeDecimals);
}
