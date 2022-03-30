/**
 * Take the existing type, and make specific fields required, while leaving the rest as is
 */
export type WithRequired<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Removes all fields from the objects that don't extend any of `TKeepTypes`
 *
 * @example
 * interface Example {
 *   a: boolean;
 *   b: number;
 *   c: number;
 * }
 * PickTypes<Example, number>; // { b: number, c: number }
 * PickTypes<Example, boolean>; // { a: boolean }
 */
export type PickTypes<TObject, TKeepTypes> = {
  [Key in keyof TObject]: TObject[Key] extends TKeepTypes ? Key : never;
}[keyof TObject];
