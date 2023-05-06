/**
 * The current editing state of a timestamp. A timestamp can either be newly created, edited
 * (different from what the API has), or not changed when there's no difference between it and
 * what's saved to the API.
 */
export enum TimestampState {
  NotChanged,
  New,
  Edited,
}
