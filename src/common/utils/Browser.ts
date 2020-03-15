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
      const keyMap = await browser.storage.local.get(key);
      return (keyMap[key] as unknown) as T;
    },
    getAll: async <T extends { [key: string]: any }>(keys: (keyof T)[]): Promise<T> => {
      return (await browser.storage.local.get(keys as any)) as T;
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
    return getURL('assets/' + extUrl);
  }

  public static openPopup(): void {
    // @ts-ignore
    if (browser) browser.browserAction.openPopup();
  }

  public static getURL(): string {
    return window.location != window.parent.location ? document.referrer : document.location.href;
  }
}
