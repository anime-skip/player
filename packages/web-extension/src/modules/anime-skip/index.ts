import { Auth } from '~types';
import { loadedLog } from '~/utils/log';
import { webExtStorage } from '~/utils/web-ext-storage';
import { sendMessage } from '~/utils/web-ext-bridge';

export function initAnimeSkipParent() {
  loadedLog('content-scripts/anime-skip/index.ts');

  /**
   * TODO: (2) Remove after web is deployed with event listener support
   * @deprecated in favor of the webpage pinging with custom events below
   */
  setInterval(() => {
    // Install check
    window.postMessage('@anime-skip/install-check', '*');

    // Login check
    webExtStorage.getItem<Auth>('auth').then(auth => {
      if (auth?.token) window.postMessage('@anime-skip/login-check', '*');
    });
  }, 1000);

  // TODO: (1) Support event listener in web after this version is published
  document.addEventListener('@anime-skip/install-check', () => {
    window.postMessage('@anime-skip/install-check', '*');
  });

  // TODO: (1) Support event listener in web after this version is published
  document.addEventListener('@anime-skip/login-check', () => {
    webExtStorage.getItem<Auth>('auth', 'sync').then(auth => {
      if (auth?.token) window.postMessage('@anime-skip/login-check', '*');
    });
  });

  document.addEventListener('@anime-skip/open-login', () => {
    sendMessage('@anime-skip/open-login', undefined);
  });

  document.addEventListener('@anime-skip/open-all-settings', () => {
    sendMessage('@anime-skip/open-all-settings', undefined);
  });
}
