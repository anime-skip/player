import browser from 'webextension-polyfill';
import { loadedLog } from '~/utils/log';
import Messenger from '~/utils/Messenger';
import { webExtStorage } from '~/utils/web-ext-storage';

export function initAnimeSkipParent() {
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
    webExtStorage.getItem<any>('auth').then(auth => {
      if (auth.token) window.postMessage('@anime-skip/login-check', '*');
    });
  }, 1000);

  // TODO: (1) Support event listener in web after this version is published
  document.addEventListener('@anime-skip/install-check', () => {
    window.postMessage('@anime-skip/install-check', '*');
  });

  // TODO: (1) Support event listener in web after this version is published
  document.addEventListener('@anime-skip/login-check', () => {
    webExtStorage.getItem<any>('auth', 'sync').then(auth => {
      if (auth.token) window.postMessage('@anime-skip/login-check', '*');
    });
  });

  document.addEventListener('@anime-skip/open-login', () => {
    messenger.send('@anime-skip/open-login', undefined);
  });

  document.addEventListener('@anime-skip/open-all-settings', () => {
    messenger.send('@anime-skip/open-all-settings', undefined);
  });
}
