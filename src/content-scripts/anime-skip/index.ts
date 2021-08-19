import Browser from '~/common/utils/Browser';
import { loadedLog } from '~/common/utils/loadedLog';
import Messenger from '~/common/utils/Messenger';

loadedLog('content-scripts/anime-skip/index.ts');

const messenger = new Messenger('anime-skip.com integration');

setInterval(() => {
  // Install check
  window.postMessage('@anime-skip/install-check', '*');

  // Login check
  Browser.storage.getItem('token').then(token => {
    if (token) window.postMessage('@anime-skip/login-check', '*');
  });
}, 1000);

document.addEventListener('@anime-skip/open-login', function () {
  messenger.send('@anime-skip/open-login', undefined);
});
document.addEventListener('@anime-skip/open-all-settings', function () {
  messenger.send('@anime-skip/open-all-settings', undefined);
});
