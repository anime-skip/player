import { ViewOperationCompletedEvent } from '../utils/ViewOperationCompletedEvent';
import { View } from './useView';

/**
 * Works with `useViewOperation`. Tells that composable when a view's work is done.
 *
 * This method works using the `window.CustomEvent` API.
 *
 * @example
 * // LoginForm.vue
 * const viewOperationCompleted = useViewOpeartionCompleted('account');
 *
 * const { mutate: _login } = useLoginMutation();
 *
 * function login() {
 *   ...
 *   _login(..., {
 *     onSuccess: viewOperationCompleted,
 *   })
 * }
 */
export default function (view: View): ViewOperationCompletedFn {
  return () => {
    console.log('Dispatching view operation completed:', view);
    window.dispatchEvent(new ViewOperationCompletedEvent(view));
  };
}

type ViewOperationCompletedFn = () => void;
