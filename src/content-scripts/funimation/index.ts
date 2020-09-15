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

global.getPlayerOptions = (): PlayerOptionGroup[] => {
  const optionGroups: PlayerOptionGroup[] = [];

  const languageTitleNode = document.querySelector('#funimation-audio > dt');
  if (languageTitleNode != null) {
    const options = Array.from(document.querySelectorAll('#funimation-audio a'));
    if (options.length > 0) {
      optionGroups.push({
        title: 'Language',
        icon: 'ic_player_option_language.svg',
        options: options.map<PlayerOption>(option => ({
          isSelected: option.classList.contains('funimation-selected'),
          node: option as HTMLElement,
          title: option.textContent?.trim() ?? 'Unknown',
        })),
      });
    }
  }

  const subtitlesTitleNode = document.querySelector('#funimation-tracks > dt');
  if (subtitlesTitleNode != null) {
    const options = Array.from(document.querySelectorAll('#funimation-tracks a'));
    if (options.length > 0) {
      optionGroups.push({
        title: 'Subtitles',
        icon: 'ic_player_option_subtitles.svg',
        options: options.map<PlayerOption>(option => ({
          isSelected: option.classList.contains('funimation-selected'),
          node: option as HTMLElement,
          title: option.textContent?.trim() ?? 'Unknown',
        })),
      });
    }
  }

  const qualityTitleNode = document.querySelector('#funimation-quality > dt');
  if (qualityTitleNode != null) {
    const options = Array.from(document.querySelectorAll('#funimation-quality a'));
    if (options.length > 0) {
      optionGroups.push({
        title: 'Quality',
        icon: 'ic_player_option_quality.svg',
        options: options.map<PlayerOption>(option => ({
          isSelected: option.classList.contains('funimation-selected'),
          node: option as HTMLElement,
          title: option.textContent?.trim() ?? 'Unknown',
        })),
      });
    }
  }

  console.log('funimation.getPlayerOptions', optionGroups);

  return optionGroups;
};

global.inferEpisodeInfo = async (): Promise<InferredEpisodeInfo> => {
  console.log('funimation.inferEpisodeInfo');
  return await browser.runtime.sendMessage({
    type: '@anime-skip/inferEpisodeInfo',
  });
};

document.body.classList.add('hide-for-anime-skip');
