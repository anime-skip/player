import Browser from '@/common/utils/Browser';

console.log('INJECTED content-scripts/anime-skip/index.ts');

setInterval(() => {
  // Install check
  window.postMessage('@anime-skip/install-check', '*');

  // Login check
  Browser.storage.getItem('token').then(token => {
    if (token) window.postMessage('@anime-skip/login-check', '*');
  });
}, 1000);
