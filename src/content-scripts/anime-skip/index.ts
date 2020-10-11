import Browser from '@/common/utils/Browser';
import Messenger from '@/common/utils/Messenger';

console.log('INJECTED content-scripts/anime-skip/index.ts');

const messenger = new Messenger('anime-skip.com integration');

setInterval(() => {
  // Install check
  window.postMessage('@anime-skip/install-check', '*');

  // Login check
  Browser.storage.getItem('token').then(token => {
    if (token) window.postMessage('@anime-skip/login-check', '*');
  });
}, 1000);

document.addEventListener('@anime-skip/open-popup', function() {
  messenger.send('@anime-skip/open-popup', undefined);
});
document.addEventListener('@anime-skip/open-options', function() {
  messenger.send('@anime-skip/open-options', undefined);
});
