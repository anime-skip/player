import Browser from 'webextension-polyfill';

async function updateDom() {
  try {
    const url = window.location.href;
    const html = document.getElementsByTagName('html')[0].innerHTML;
    console.log('[inspector] Updating HTML for', url);
    await Browser.storage.local.set({ [url]: html });
  } catch (err) {
    console.error('[inspector]', err);
  }
}

updateDom();
setInterval(updateDom, 1e3);
