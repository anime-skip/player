/* eslint-disable @typescript-eslint/no-unused-vars */
import Utils from '@/common/utils/Utils';
import './style.scss';

console.log('INJECTED content-scripts/crunchyroll/index.ts');

global.service = 'crunchyroll';
global.serviceDisplayName = 'Crunchyroll';

global.getRootQuery = (): string => {
  return 'body';
};

global.getVideoQuery = (): string => {
  return 'video';
};

global.transformServiceUrl = (inputUrl: string) => {
  console.error('transformed: ', inputUrl, Utils.stripUrl(inputUrl).replace(/-[0-9]+$/, ''));
  // Strip and remove -XXXXXX from end of url
  return Utils.stripUrl(inputUrl).replace(/-[0-9]+$/, '');
};

global.inferEpisodeInfo = async (): Promise<InferredEpisodeInfo> => {
  console.debug('crunchyroll.inferEpisodeInfo');
  return await browser.runtime.sendMessage({
    type: '@anime-skip/inferEpisodeInfo',
  });
};

async function openSettingsMenu() {
  // Show controls

  // Click menu
  const toggleSettings = document.getElementById('settingsControl') as HTMLDivElement | null;
  console.log({ toggleSettings });
  toggleSettings?.click();

  // Wait for dialog to show
  const max = 20; // 1s
  let i = 0;
  do {
    // Utils.sleep(50);
    i++;
  } while (document.querySelector('div[data-testid="vilos-settings_menu"]') == null && i <= max);
}

global.getPlayerOptions = async (): Promise<PlayerOptionGroup[]> => {
  // await openSettingsMenu();
  const optionGroups: PlayerOptionGroup[] = [];

  // const autoPlayNode = document.querySelector('div[data-testid="vilos-settings_autoplay_toggle"]');
  // console.log({ autoPlayNode });

  // const subtitlesNode = document.querySelector(
  //   'div[data-testid="vilos-settings_texttrack_submenu"]'
  // );
  // console.log({ subtitlesNode });

  // const qualityNode = document.querySelector('div[data-testid="vilos-settings_quality_submenu"]');
  // console.log({ qualityNode });

  // const qualityTitleNode = document.querySelector('.qualityMenuButton.baseSettingsMenuItem');
  // if (qualityTitleNode != null) {
  //   const options = Array.from(
  //     document.querySelectorAll('.qualityMenuItemSelector.settingsMenuItemSelectionCircle')
  //   );
  //   if (options.length > 0) {
  //     optionGroups.push({
  //       title: 'Quality',
  //       icon: 'ic_player_option_quality.svg',
  //       options: options.map<PlayerOption>(option => ({
  //         isSelected: option.classList.contains('selected'),
  //         node: option as HTMLElement,
  //         title: option.textContent?.replace(/ {2}/g, ' ').trim() ?? 'Unknown',
  //       })),
  //     });
  //   }
  // }

  // const subtitlesTitleNode = document.querySelector('.subtitleMenuButton.baseSettingsMenuItem');
  // if (subtitlesTitleNode != null) {
  //   const options = Array.from(
  //     document.querySelectorAll('.subtitlesMenuItemSelector.settingsMenuItemSelectionCircle')
  //   );
  //   if (options.length > 0) {
  //     optionGroups.push({
  //       title: 'Subtitles',
  //       icon: 'ic_player_option_subtitles.svg',
  //       options: options.map<PlayerOption>(option => ({
  //         isSelected: option.classList.contains('selected'),
  //         node: option as HTMLElement,
  //         title: option.textContent ?? 'Unknown',
  //       })),
  //     });
  //   }
  // }

  console.log('crunchyroll.getPlayerOptions', optionGroups);

  return optionGroups;
};

document.body.classList.add('hide-for-anime-skip');
