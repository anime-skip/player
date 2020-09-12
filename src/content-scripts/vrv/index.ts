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
  // const subtitle = (document.querySelector('.video-subtitle') as HTMLDivElement).innerText.split(
  //   ':'
  // );
  // let season: string | undefined = subtitle[0];
  // if (season) {
  //   season = season.replace('SEASON', '').trim();
  // }
  // let episodeNumber: string | undefined = subtitle[1];
  // if (episodeNumber) {
  //   episodeNumber = episodeNumber.replace('EPISODE', '').trim();
  // }
  // return {
  //   nameame: (document.querySelector('.video-title') as HTMLDivElement).innerText,
  //   episodeNumber,
  //   season,
  //   showName,
  // };
  return {
    name: '',
    number: '',
    show: '',
  };
};

document.body.classList.add('hide-for-anime-skip');
