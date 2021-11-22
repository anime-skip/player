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
