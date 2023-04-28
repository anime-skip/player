/**
 * Return a value, but make sure it's within a specified bound: `[min, max]`.
 */
export function bounded(v: number, min: number, max: number): number {
  if (v < min) return min;
  if (v > max) return max;
  return v;
}
