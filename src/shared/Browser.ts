export default class Browser {

    public static storage = {
        getItem: async <T>(key: string): Promise<T | undefined> => {
            // @ts-ignore
            if (browser) {
                // @ts-ignore
                const keyMap = await browser.storage.local.get(key);
                return keyMap[key];
            }
            // @ts-ignore
            else if (chrome) getItem = chrome.storage.local.get;

            throw Error('"browser" or "chrome" are not defined');
        },
    };

    public static resolveUrl(extUrl: string): string {
        let getURL = (_?: string) => extUrl;
        // @ts-ignore
        if (browser) getURL = browser.runtime.getURL;
        // @ts-ignore
        else if (chrome) getURL = chrome.runtime.getURL;
        return getURL(extUrl);
    }

}
