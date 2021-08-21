import { browser } from 'webextension-polyfill-ts';
import { loadedLog } from '~/common/utils/loadedLog';
import Messenger from '~/common/utils/Messenger';

loadedLog('content-scripts/anime-skip/index.ts');

const messenger = new Messenger('anime-skip.com integration');

/**
 * TODO: (2) Remove after web is deployed with event listener support
 * @deprecated in favor of the webpage pinging with custom events below
 */
setInterval(() => {
  // Install check
  window.postMessage('@anime-skip/install-check', '*');

  // Login check
  browser.storage.sync.get('auth').then(token => {
    if (token) window.postMessage('@anime-skip/login-check', '*');
  });
}, 1000);

// TODO: (1) Support event listener in web after this version is published
document.addEventListener('@anime-skip/install-check', () => {
  window.postMessage('@anime-skip/install-check', '*');
});

// TODO: (1) Support event listener in web after this version is published
document.addEventListener('@anime-skip/login-check', () => {
  browser.storage.sync.get('auth').then(({ auth }) => {
    if (auth.token) window.postMessage('@anime-skip/login-check', '*');
  });
});

document.addEventListener('@anime-skip/open-login', () => {
  messenger.send('@anime-skip/open-login', undefined);
});

document.addEventListener('@anime-skip/open-all-settings', () => {
  messenger.send('@anime-skip/open-all-settings', undefined);
});
