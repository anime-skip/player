/* eslint-disable @typescript-eslint/no-unused-vars */
import './style.scss';

console.log('INJECTED content-scripts/funimation/index.ts');

global.service = 'funimation';
global.serviceDisplayName = 'Funimation';

global.getRootQuery = (): string => {
  return 'body #funimation-player';
};

global.getVideoQuery = (): string => {
  return '#brightcove-player > video';
};

global.transformServiceUrl = (inputUrl: string): string => {
  // Remove query params
  return inputUrl.split('?', 1)[0];
};

global.inferEpisodeInfo = async (): Promise<InferredEpisodeInfo> => {
  console.log('funimation.inferEpisodeInfo');
  return await browser.runtime.sendMessage({
    type: '@anime-skip/inferEpisodeInfo',
  });
};

document.body.classList.add('hide-for-anime-skip');
