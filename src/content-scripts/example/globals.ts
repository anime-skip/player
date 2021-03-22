/* eslint-disable @typescript-eslint/no-unused-vars */
import './style.scss';

console.log('INJECTED content-scripts/example/index.ts');

global.service = 'example';
global.serviceDisplayName = 'Anime Skip Example';

global.getRootQuery = (): string => {
  return '.video-container';
};

global.inferEpisodeInfo = async (): Promise<InferredEpisodeInfo> => {
  console.debug('example.inferEpisodeInfo');
  return await browser.runtime.sendMessage({ type: '@anime-skip/inferEpisodeInfo' });
};

global.getVideoQuery = (): string => {
  return '#video';
};
