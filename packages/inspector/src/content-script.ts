import Browser from 'webextension-polyfill';

function getHtml(url: string) {
  const html = document.body.outerHTML;
  console.log(html.substring(0, 20));

  return `<html>\n<!-- Copied via https://github.com/anime-skip/player/tree/main/packages/inspector -->\n<!-- ${url} -->\n${html}\n</html>`;
}

async function updateDom() {
  try {
    let url = window.location.href;
    if (self !== top) {
      url += '-iframe';
    }
    console.log('[inspector] Updating HTML for', url);
    await Browser.storage.local.set({ [url]: getHtml(url) });
  } catch (err) {
    console.error('[inspector]', err);
  }
}

const ignored = [
  // Reduce zoro.to spam
  'recaptcha',
  'onetag',
  'quantum',
  'vlitag',
  'addthis',
  'prebid',
  'adnxs',
];

try {
  if (!ignored.find(i => location.href.includes(i))) {
    updateDom();
    setInterval(updateDom, 1e3);
  }
} catch (err) {
  console.error(err);
}
