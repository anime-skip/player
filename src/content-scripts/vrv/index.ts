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

global.getPlayerOptions = (): PlayerOptionGroup[] => {
  const optionGroups: PlayerOptionGroup[] = [];

  const qualityTitleNode = document.querySelector('.qualityMenuButton.baseSettingsMenuItem');
  if (qualityTitleNode != null) {
    const options = Array.from(
      document.querySelectorAll('.qualityMenuItemSelector.settingsMenuItemSelectionCircle')
    );
    if (options.length > 0) {
      optionGroups.push({
        title: 'Quality',
        icon: 'ic_player_option_quality.svg',
        options: options.map<PlayerOption>(option => ({
          isSelected: option.classList.contains('selected'),
          node: option as HTMLElement,
          title: option.textContent?.replace(/  /g, ' ').trim() ?? 'Unknown Quality',
        })),
      });
    }
  }

  const subtitlesTitleNode = document.querySelector('.subtitleMenuButton.baseSettingsMenuItem');
  if (subtitlesTitleNode != null) {
    const options = Array.from(
      document.querySelectorAll('.subtitlesMenuItemSelector.settingsMenuItemSelectionCircle')
    );
    if (options.length > 0) {
      optionGroups.push({
        title: 'Subtitles',
        icon: 'ic_player_option_subtitles.svg',
        options: options.map<PlayerOption>(option => ({
          isSelected: option.classList.contains('selected'),
          node: option as HTMLElement,
          title: option.textContent ?? 'Unknown Language',
        })),
      });
    }
  }

  console.log('vrv.getPlayerOptions', optionGroups);

  return optionGroups;
};

document.body.classList.add('hide-for-anime-skip');
