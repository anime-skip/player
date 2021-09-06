import { Ref } from 'vue';

/**
 * ONLY FOR LOGS - serialize the raw value of a ref using `JSON.parse(JSON.stringify(...))`
 */
export function deref<T>(ref: Ref<T>): T {
  return JSON.parse(JSON.stringify(ref.value));
}
