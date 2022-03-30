/**
 * Take the existing type, and make specific fields required, while leaving the rest as is
 */
export type WithRequired<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Removes all fields from the objects that don't extend any of `TKeepTypes`
 *
 * TODO: Rename to `PickTypes`
 *
 * @example
 * interface Example {
 *   a: boolean;
 *   b: number;
 *   c: number;
 * }
 * StripOtherTypes<Example, number>; // { b: number, c: number }
 * StripOtherTypes<Example, boolean>; // { a: boolean }
 */
export type StripOtherTypes<TObject, TKeepTypes> = {
  [Key in keyof TObject]: TObject[Key] extends TKeepTypes ? Key : never;
}[keyof TObject];
