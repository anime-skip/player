// prettier-ignore

import { BrowserType } from "../types";

/**
 * Return which browser this code is running on
 *
 * https://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser
 *
 * TODO: Replace with js-ua-parser (works in background script for MV3)
 */
export function detectBrowser(): BrowserType {
  // Unknown for service workers, just use the target instead
  if (typeof window === 'undefined')
    throw Error('Cannot find browser when `window` is not present');

  // Opera 8.0+
  // @ts-expect-error: difficult typing
  if ((!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0)
    return 'opera';

  // Firefox 1.0+
  // @ts-expect-error: difficult typing
  if (typeof InstallTrigger !== 'undefined') return 'firefox';

  // Safari 3.0+ "[object HTMLElementConstructor]"
  if (
    // @ts-expect-error: difficult typing
    /constructor/i.test(window.HTMLElement) ||
    (function (p) {
      return p.toString() === '[object SafariRemoteNotification]';
      // @ts-expect-error: difficult typing
    })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification))
  )
    return 'safari';

  // Internet Explorer 6-11
  // @ts-expect-error: difficult typing
  const isIe = /*@cc_on!@*/ false || !!document.documentMode;
  // Edge 20+
  if (!isIe && !!window.StyleMedia) return 'edge';
  if (isIe) return 'ie';

  // Chrome 1 - 79
  // @ts-expect-error: difficult typing
  const isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
  // Edge (based on chromium) detection
  if (isChrome && navigator.userAgent.indexOf('Edg') != -1) return 'edgechromium';
  if (isChrome) return 'chrome';

  return 'unsupported';
}
