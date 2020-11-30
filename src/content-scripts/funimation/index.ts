/* eslint-disable @typescript-eslint/no-unused-vars */
import Utils from '@/common/utils/Utils';
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

global.transformServiceUrl = Utils.stripUrl;

global.getPlayerOptions = (): PlayerOptionGroup[] => {
  const optionGroups: PlayerOptionGroup[] = [];

  function addRadioOptionGroup(id: string, title: string, icon?: string): void {
    const languageSubMenu = document.getElementById(id);
    if (languageSubMenu != null) {
      const options = Array.from(
        languageSubMenu.querySelectorAll('li.funimation-li-option a.funimation-toggle-option')
      );
      if (options.length > 0) {
        optionGroups.push({
          title,
          icon,
          options: options.map<PlayerOption>(option => ({
            isSelected: option.classList.contains('funimation-selected'),
            node: option as HTMLElement,
            title: option.textContent?.trim() ?? 'Unknown',
          })),
        });
      }
    }
  }

  addRadioOptionGroup('funimation-audio-sub-menu', 'Language', 'ic_player_option_language.svg');
  addRadioOptionGroup('funimation-tracks-sub-menu', 'Subtitles', 'ic_player_option_subtitles.svg');
  addRadioOptionGroup('funimation-quality-sub-menu', 'Quality', 'ic_player_option_quality.svg');
  addRadioOptionGroup('funimation-version-sub-menu', 'Version');

  console.debug('funimation.getPlayerOptions', optionGroups);

  return optionGroups;
};

global.inferEpisodeInfo = async (): Promise<InferredEpisodeInfo> => {
  console.debug('funimation.inferEpisodeInfo');
  return await browser.runtime.sendMessage({
    type: '@anime-skip/inferEpisodeInfo',
  });
};

document.body.classList.add('hide-for-anime-skip');
