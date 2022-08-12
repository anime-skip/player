import { loadedLog } from '~/utils/log';
import { setupPlayerConfig } from '~/utils/setup-player-config';
import { PlayerOption, PlayerOptionGroup } from '~types';
import GeneralUtils from '~utils/GeneralUtils';
import './player-overrides.scss';

function getPlaybackOptions(): PlayerOptionGroup[] {
  const optionGroups: PlayerOptionGroup[] = [];

  function addRadioOptionGroup(id: string, title: string, icon?: string): void {
    const subMenu = document.getElementById(id);
    if (subMenu != null) {
      const options = Array.from(
        subMenu.querySelectorAll('li.funimation-li-option a.funimation-toggle-option')
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

export function initFunimationPlayer() {
  loadedLog('content-scripts/services/funimation/player.ts');

  return setupPlayerConfig('funimation', {
    serviceDisplayName: 'Funimation',
    getPlaybackOptions,
    getRootQuery: () => 'body #funimation-player',
    getVideoQuery: () => '#brightcove-player > video',
    doNotReplacePlayer() {
      const path = GeneralUtils.stripUrl(window.parent.location.href)
        .replace('https://www.funimation.com/', '')
        .replace(/\/$/, '');
      // something like "show/{show-name}/..." or "show/{show-name}" so if the last slash is at position 5, it is a show
      const isShowPage = path.lastIndexOf('/') === 5;
      return isShowPage;
    },
  });
}
