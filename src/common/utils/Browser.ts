/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  persistedKeys,
  REFRESH_TOKEN_DURATION,
  ACCESS_TOKEN_DURATION,
  UNAUTHORIZED_ERROR_MESSAGE,
} from './Constants';

function prepareChangedStorage(object: any): Partial<VuexState> {
  for (const key in object) {
    object[key] = JSON.parse(object[key].newValue);
  }
  return object;
}

export default class Browser {
  public static async getAccessToken(): Promise<string> {
    const {
      token,
      tokenExpiresAt,
      refreshToken,
      refreshTokenExpiresAt,
    } = await Browser.storage.getAll<Partial<VuexState>>(persistedKeys);
    const now = Date.now();

    if (tokenExpiresAt != null && token != null && now <= tokenExpiresAt) {
      return token;
    }

    if (refreshTokenExpiresAt != null && refreshToken != null && now <= refreshTokenExpiresAt) {
      const { authToken: newToken, refreshToken: newRefreshToken } = await global.Api.loginRefresh(
        refreshToken
      );
      const newNow = Date.now();
      await Promise.all([
        Browser.storage.setItem('token', newToken),
        Browser.storage.setItem('tokenExpiresAt', newNow + ACCESS_TOKEN_DURATION),
        Browser.storage.setItem('refreshToken', newRefreshToken),
        Browser.storage.setItem('refreshTokenExpiresAt', newNow + REFRESH_TOKEN_DURATION),
      ]);
      return newToken;
    }

    throw Error(UNAUTHORIZED_ERROR_MESSAGE);
  }

  public static storage = {
    getItem: async <T>(key: string): Promise<T | undefined> => {
      // @ts-ignore
      const keyMap = await browser.storage.local.get(key);
      const value = keyMap[key] as any;
      try {
        return JSON.parse(value) as T;
      } catch (err) {
        return value as T;
      }
    },
    getAll: async <T extends { [key: string]: any }>(keys: (keyof T)[]): Promise<T> => {
      const storage = await browser.storage.local.get(keys as any);
      const data: any = {};
      keys.forEach(key => {
        try {
          data[key] = JSON.parse(storage[key]);
        } catch (err) {
          data[key] = storage[key];
        }
      });
      return data;
    },
    setItem: async (key: string, value: any): Promise<void> => {
      await browser.storage.local.set({ [key]: JSON.stringify(value) });
    },
    addListener: (callback: (changes: Partial<VuexState>) => void): void => {
      // @ts-ignore
      browser.storage.onChanged.addListener((changes, area) => {
        if (area === 'local') {
          callback(prepareChangedStorage(changes));
        }
      });
    },
  };

  public static resolveUrl(extUrl: string): string {
    let getURL = (_?: string): string => extUrl;
    // @ts-ignore
    if (browser) getURL = browser.runtime.getURL;
    // @ts-ignore
    else if (chrome) getURL = chrome.runtime.getURL;
    return getURL(extUrl);
  }

  public static openPopup(): void {
    // @ts-ignore
    if (browser) browser.browserAction.openPopup();
  }

  /**
   * Return the the url of the webpage this is ran in. Most of the time it is in a Iframe, but
   * sometimes not.
   *
   * - If we are in an iframe, we will return the referrer (the url that instancated the iframe).
   *   Note that if the page uses HTML5 history mode, url changes are not reflected in this field.
   * - If we are not in an iframe, then just return the URL of the document
   */
  public static getIframeReferrer(): string {
    let url: string;
    // Try and get the parent's url if the iframe is the same domain as the website
    try {
      return window.parent.location.href;
    } catch (err) {
      console.warn('getIframeReferrer', err);
      return window.location != window.parent.location ? document.referrer : document.location.href;
    }
  }

  // prettier-ignore
  /**
   * https://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser
   */
  public static detect(): BrowserType {
    // Opera 8.0+
    // @ts-ignore
    if ((!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0)
      return "opera";

    // Firefox 1.0+
    // @ts-ignore
    if (typeof InstallTrigger !== 'undefined')
      return "firefox";

    // Safari 3.0+ "[object HTMLElementConstructor]" 
    // @ts-ignore
    if (/constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification)))
      return "safari";

    // Internet Explorer 6-11
    // @ts-ignore
    const isIe = /*@cc_on!@*/false || !!document.documentMode;
    // Edge 20+
    if (!isIe && !!window.StyleMedia)
      return "edge";
    if (isIe)
      return "ie";

    // Chrome 1 - 79
    // @ts-ignore
    const isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
    // Edge (based on chromium) detection
    if (isChrome && (navigator.userAgent.indexOf("Edg") != -1))
      return "edgechromium";
    if (isChrome)
      return "chrome";

    return "unsupported"
  }

  public static transformServiceUrl(tabUrl: string): string {
    return (global.transformServiceUrl && global.transformServiceUrl(tabUrl)) ?? tabUrl;
  }
}
