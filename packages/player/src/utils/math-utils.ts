/**
 * Return a value, but make sure it's within a specified bound: `[min, max]`.
 */
export function bounded(v: number, min: number, max: number): number {
  if (v < min) return min;
  if (v > max) return max;
  return v;
}

/**
 * Rounds a number to the nearest increment at a given percision.
 */
export function floorToNearest(
  num: number,
  increment: number,
  precision: number,
): number {
  // We need to prevent floating point errors resulting in the floor being 1 increment less than
  // expected, so we add a small amount to the division.
  const nearest = Math.floor(num / increment + 0.000000001) * increment;
  return Number(nearest.toFixed(precision));
}
