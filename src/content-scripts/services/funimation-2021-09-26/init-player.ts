import { waitUntil } from '~/common/utils/EventLoop';
import { loadedLog } from '~/common/utils/loadedLog';
import setupGlobals from '~/common/utils/setupGlobals';
import './init-player.scss';

loadedLog('content-scripts/services/funimation-2021-09-26/init-player.ts');

const titleToIconMap: Record<string, string | undefined> = {
  'Audio Language': 'ic_player_option_language.svg',
  Subtitles: 'ic_player_option_subtitles.svg',
  'Video Quality': 'ic_player_option_quality.svg',
};

async function getPlayerOptions(): Promise<PlayerOptionGroup[]> {
  const optionGroups: PlayerOptionGroup[] = [];
  const languagePanelQuery = '.version-language-panel';
  const settingsQuery = '.player-settings';

  const loadOptions = async () => {
    const hasLoadedOptions = () =>
      document.querySelectorAll(`${languagePanelQuery} .v-list--subheader .v-radio`).length > 0;
    if (!hasLoadedOptions) {
      await waitUntil(hasLoadedOptions, 500);
    }
  };

  const addOption = (panelQuery: string) => (subMenu: Element, index: number) => {
    const title = subMenu.textContent?.trim() ?? 'Unknown Setting';
    const options = Array.from(
      // index + 2 because nth-child starts at 1, then the first subheader is the list of settings available
      document.querySelectorAll(`${panelQuery} .v-list--subheader:nth-child(${index + 2}) .v-radio`)
    );

    optionGroups.push({
      title,
      icon: titleToIconMap[title],
      options: options.map<PlayerOption>(option => ({
        node: option as HTMLElement,
        isSelected: option.classList.contains('v-item--active'),
        title: option.textContent?.trim() ?? 'Unknown option',
      })),
    });
  };

  // Funimation player requires you to click the buttons before settings are loaded into html, but
  // then they stay there
  await loadOptions();

  // Language popup
  document
    .querySelectorAll(
      `${languagePanelQuery} .v-menu__content .v-list:nth-child(1) .v-list-item .v-list-item__title`
    )
    .forEach(addOption(languagePanelQuery));

  // Settings popup
  document
    .querySelectorAll(
      `${settingsQuery} .v-menu__content .v-list:nth-child(1) .v-item-group .v-list-item .v-list-item__title`
    )
    .forEach(addOption(settingsQuery));

  return optionGroups;
}

setupGlobals('funimation', {
  serviceDisplayName: 'Funimation',
  getPlayerOptions,
  getRootQuery() {
    return 'body';
  },
  getVideoQuery() {
    return '#vjs_video_3_html5_api';
  },
});
