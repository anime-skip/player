import { loadedLog } from '~/common/utils/log';
import { setupPlayerConfig } from '~/common/utils/setup-player-config';
import './player-overrides.scss';

export function setupZoroPlayer() {
  loadedLog('content-scripts/services/zoro/player.ts');

  return setupPlayerConfig('zoro', {
    serviceDisplayName: 'Zoro.to',
    getRootQuery: () => 'body',
    getVideoQuery: () => 'video',
    transformServiceUrl: inputUrl => {
      const cleanUrl = new URL(inputUrl);
      const ep = cleanUrl.searchParams.get('ep');
      if (ep) {
        return `${cleanUrl.origin}${cleanUrl.pathname}?ep=${ep}`;
      } else {
        return cleanUrl.origin + cleanUrl.pathname;
      }
    },
  });
}
