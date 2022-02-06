type ValueOf<T> = T[keyof T];

type Implements<T, U extends T> = {};

/**
 * Remove all fields with a specific type
 */
type StripOtherTypes<TObject, TKeepTypes> = {
  [Key in keyof TObject]: TObject[Key] extends TKeepTypes ? Key : never;
}[keyof TObject];
