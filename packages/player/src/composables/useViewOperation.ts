import { ViewOperationCompletedEvent } from '../utils/ViewOperationCompletedEvent';
import { View } from './useView';

/**
 * Used to perform a behavior after a view's work is done. Here's a couple examples:
 *
 * 1. Create a timestamp after logging in
 * 2. Closing the side panel after creating a timestamp
 *
 * This method returns a function. Wrap the code you want to run after the view has finished it's
 * operation, and pass it in as the second argument.
 *
 * The returned function will, when called, open the requested view and run your code once the view is completed.
 *
 * Also see `useViewOperationCompleted` for telling this method when a view's operation is completed.
 *
 * @example
 * // SidePanelTimestamps.vue
 * const { view } = useView();
 * const loginThen = useViewOperation("account")
 *
 * // Login, and once logged in, open this view back up
 * const loginAndReturn = useViewOperation("account", () => {
 *   view.value = 'timestamps';
 * });
 */
export default function <T extends (...args: any[]) => void>(
  operationView: View,
  operation: T,
): T {
  const { view: currentView } = useView();

  function waitForCompleted(): Promise<void> {
    return new Promise<void>((res) => {
      const callback = (e: Event) => {
        const event = e as ViewOperationCompletedEvent;
        console.log('EVENT RECIEVED', event.detail, event.view);
        if (event.view === operationView) {
          removeEventListener();
          res();
        }
      };

      window.addEventListener(ViewOperationCompletedEvent.TYPE, callback);
      const removeEventListener = () =>
        window.removeEventListener(ViewOperationCompletedEvent.TYPE, callback);
    });
  }

  // @ts-expect-error: Generic typing not happy
  return (...args: any[]): any => {
    currentView.value = operationView;

    waitForCompleted()
      .then(() => operation(...args))
      .catch((err) =>
        console.debug('View operation timed out and aborted.', err),
      );
  };
}
