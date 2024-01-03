export default defineContentScript({
  matches: ['*://*.anime-skip.com/*'],

  main() {
    logger.log('Anime skip content script started...');

    // Tell the webpage the extension is installed.
    setInterval(() => {
      // Install check
      window.postMessage('@anime-skip/install-check', '*');

      // Login check
      isLoggedIn().then((isLoggedIn) => {
        if (isLoggedIn) window.postMessage('@anime-skip/login-check', '*');
      });
    }, 1000);

    // TODO: (1) Support event listener in web after this version is published
    document.addEventListener('@anime-skip/install-check', () => {
      window.postMessage('@anime-skip/install-check', '*');
    });

    // TODO: (1) Support event listener in web after this version is published
    document.addEventListener('@anime-skip/login-check', async () => {
      if (await isLoggedIn()) {
        window.postMessage('@anime-skip/login-check', '*');
      }
    });

    document.addEventListener('@anime-skip/open-login', () => {
      console.warn('Open login not implemented');
      // TODO: Open popup URL in new tab
    });

    document.addEventListener('@anime-skip/open-all-settings', () => {
      console.warn('Open all settings not implemented');
      // TODO: Open popup URL in new tab
    });
  },
});

async function isLoggedIn() {
  const auth = await storage.getItem('local:@anime-skip/player/auth');
  return auth != null;
}
