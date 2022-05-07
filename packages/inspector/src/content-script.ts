import Browser from 'webextension-polyfill';

function getHtml(url: string) {
  const html = document.getElementsByTagName('html')[0].innerHTML;
  return `<html>\n<!-- Copied via https://github.com/anime-skip/player/tree/main/packages/inspector -->\n<!-- ${url} -->\n${html}\n</html>`;
}

async function updateDom() {
  try {
    const url = window.location.href;
    console.log('[inspector] Updating HTML for', url);
    await Browser.storage.local.set({ [url]: getHtml(url) });
  } catch (err) {
    console.error('[inspector]', err);
  }
}

updateDom();
setInterval(updateDom, 1e3);
