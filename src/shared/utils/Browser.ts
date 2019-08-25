function prepareChangedStorage(object: any): Partial<VuexState> {
  for (const key in object) {
    object[key] = JSON.parse(object[key].newValue);
  }
  return object;
}

export default class Browser {
  public static storage = {
    getItem: async <T>(key: string): Promise<T | undefined> => {
      // @ts-ignore
      if (browser) {
        // @ts-ignore
        const keyMap = await browser.storage.local.get(key);
        try {
          return JSON.parse(keyMap[key]);
        } catch (err) {
          return keyMap[key];
        }
      }
      // // @ts-ignore
      // else if (chrome) getItem = chrome.storage.local.get;

      throw Error('"browser" or "chrome" are not defined');
    },
    getAll: async <T>(keys: string[]): Promise<T> => {
      // @ts-ignore
      if (browser) {
        // @ts-ignore
        const values = await browser.storage.local.get(keys);
        const parsed: any = {};
        for (const key in values) {
          if (values.hasOwnProperty(key)) {
            parsed[key] = JSON.parse(values[key]);
          }
        }
        return parsed;
      }
      // // @ts-ignore
      // else if (chrome) getItem = chrome.storage.local.get;

      throw Error('"browser" or "chrome" are not defined');
    },
    setItem: async (key: string, value: any): Promise<void> => {
      // @ts-ignore
      if (browser) {
        // @ts-ignore
        await browser.storage.local.set({ [key]: value });
        return;
      }
      // // @ts-ignore
      // else if (chrome) setItem = chrome.storage.local.set;
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

  public static getURL(): string {
    return window.location != window.parent.location
      ? document.referrer
      : document.location.href;
  }
}
