import { persistedKeys, REFRESH_TOKEN_DURATION, ACCESS_TOKEN_DURATION } from './Constants';

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

    throw Error('unauthorized - log out');
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
    return getURL('assets/' + extUrl);
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
    return window.location != window.parent.location ? document.referrer : document.location.href;
  }
}
