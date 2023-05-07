import { T } from 'vitest/dist/types-e3c9754d';

/**
 * Given an array of objects, return a map of (`key` to `item`).
 *
 * If multiple items have the same value at `key`, the later item in the array will be present in
 * the final map.
 */
export function getUniqueExistenceMap<
  TType extends Record<string, any>,
  TKey extends keyof TType,
>(array: TType[], key: TKey): Record<TType[TKey], TType> {
  return array.reduce((map, t) => {
    map[t[key]] = t;
    return map;
  }, {} as Record<TType[TKey], TType>);
}

export function deleteMatches<T>(array: T[], isMatch: (t: T) => boolean): T[] {
  const newArray: T[] = [];
  for (const t of array) {
    if (!isMatch(t)) newArray.push(t);
  }
  return newArray;
}
