import Browser from 'webextension-polyfill';

export function getPopupUrl(options?: { closeAfterLogin?: boolean }): string {
  const url = new URL(Browser.runtime.getURL('popup.html'));
  if (options?.closeAfterLogin) url.searchParams.set('closeAfterLogin', 'true');
  return url.toString();
}

export function getOptionsUrl(): string {
  return Browser.runtime.getURL('options.html');
}
