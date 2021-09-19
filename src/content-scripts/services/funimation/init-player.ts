import { loadedLog } from '~/common/utils/loadedLog';
import setupGlobals from '~/common/utils/setupGlobals';
import Utils from '~/common/utils/Utils';
import './init-player.scss';

loadedLog('content-scripts/services/funimation/init-player.ts');

function getPlayerOptions(): PlayerOptionGroup[] {
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

  return optionGroups;
}

setupGlobals('funimation', {
  serviceDisplayName: 'Funimation',
  getPlayerOptions,
  getRootQuery() {
    return 'body #funimation-player';
  },
  getVideoQuery() {
    return '#brightcove-player > video';
  },
  doNotReplacePlayer() {
    const path = Utils.stripUrl(window.parent.location.href)
      .replace('https://www.funimation.com/', '')
      .replace(/\/$/, '');
    // something like "show/{show-name}/..." or "show/{show-name}" so if the last slash is at position 5, it is a show
    const isShowPage = path.lastIndexOf('/') === 5;
    return isShowPage;
  },
});
