/* eslint-disable @typescript-eslint/no-unused-vars */
import './style.scss';

console.log('INJECTED content-scripts/vrv/index.ts');

global.service = 'vrv';
global.serviceDisplayName = 'VRV';

global.getRootQuery = (): string => {
  return 'body>div';
};

global.getVideoQuery = (): string => {
  return 'video';
};

global.inferEpisodeInfo = async (): Promise<InferredEpisodeInfo> => {
  console.log('vrv.inferEpisodeInfo');
  return await browser.runtime.sendMessage({
    type: '@anime-skip/inferEpisodeInfo',
  });
};

document.body.classList.add('hide-for-anime-skip');
