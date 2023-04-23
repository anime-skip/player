import { InjectionKey } from '../utils/InjectionKey';

/**
 * Get objects from the current shadow.
 */
export default function () {
  const values = inject<{ shadowHtml: HTMLHtmlElement; shadow: ShadowRoot }>(
    InjectionKey.ShadowRoot,
  );
  if (values == null)
    throw Error(
      'ShadowRoot details not provided. Did you forget to call provide?',
    );
  return values;
}
