// TODO: Is this file still needed, or can things be moved elsewhere?

import { browser } from 'webextension-polyfill-ts';

export default class Browser {
  public static resolveUrl(extUrl: string): string {
    let getURL = (_?: string): string => extUrl;
    // @ts-expect-error: difficult typing
    if (browser) getURL = browser.runtime.getURL;
    // @ts-expect-error: difficult typing
    else if (chrome) getURL = chrome.runtime.getURL;
    return getURL(extUrl);
  }

  public static openPopup(): void {
    if (browser) browser.browserAction.openPopup();
  }

  // prettier-ignore
  /**
   * https://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser
   */
  public static detect(): BrowserType {
    // Opera 8.0+
    // @ts-expect-error: difficult typing
    if ((!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0)
      return "opera";

    // Firefox 1.0+
    // @ts-expect-error: difficult typing
    if (typeof InstallTrigger !== 'undefined')
      return "firefox";

    // Safari 3.0+ "[object HTMLElementConstructor]" 
    // @ts-expect-error: difficult typing
    if (/constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification)))
      return "safari";

    // Internet Explorer 6-11
    // @ts-expect-error: difficult typing
    const isIe = /*@cc_on!@*/false || !!document.documentMode;
    // Edge 20+
    if (!isIe && !!window.StyleMedia)
      return "edge";
    if (isIe)
      return "ie";

    // Chrome 1 - 79
    // @ts-expect-error: difficult typing
    const isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
    // Edge (based on chromium) detection
    if (isChrome && (navigator.userAgent.indexOf("Edg") != -1))
      return "edgechromium";
    if (isChrome)
      return "chrome";

    return "unsupported"
  }

  public static transformServiceUrl(tabUrl: string): string {
    return window.transformServiceUrl?.(tabUrl) ?? tabUrl;
  }
}
