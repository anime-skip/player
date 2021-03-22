import { State } from '../store/state';
import {
  persistedKeys,
  REFRESH_TOKEN_DURATION,
  ACCESS_TOKEN_DURATION,
  UNAUTHORIZED_ERROR_MESSAGE,
} from './Constants';

function prepareChangedStorage(object: Record<string, { newValue: string }>): Partial<State> {
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
    } = await Browser.storage.getAll<Partial<State>>(persistedKeys);
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
      const keyMap = await browser.storage.local.get(key);
      const value = keyMap[key] as string | T;
      try {
        return JSON.parse(value as string) as T;
      } catch (err) {
        return value as T;
      }
    },
    getAll: async <T extends { [key: string]: string | unknown }>(
      keys: (keyof T)[]
    ): Promise<T> => {
      // @ts-expect-error: difficult typing
      const storage = await browser.storage.local.get(keys);
      const data = {} as { [key in keyof T]: T[key] };
      keys.forEach(key => {
        try {
          // @ts-expect-error: difficult typing
          data[key] = JSON.parse(storage[key]);
        } catch (err) {
          // @ts-expect-error: difficult typing
          data[key] = storage[key];
        }
      });
      return data;
    },
    setItem: async (key: string, value: unknown): Promise<void> => {
      await browser.storage.local.set({ [key]: JSON.stringify(value) });
    },
    addListener: (callback: (changes: Partial<State>) => void): void => {
      browser.storage.onChanged.addListener((changes, area) => {
        if (area === 'local') {
          // @ts-expect-error: difficult typing
          callback(prepareChangedStorage(changes));
        }
      });
    },
  };

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
    return global.transformServiceUrl?.(tabUrl) ?? tabUrl;
  }
}
