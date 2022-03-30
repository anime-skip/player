import { backOff } from 'exponential-backoff';
import browser from 'webextension-polyfill';
import { IPlayerConfig } from '~/content-scripts/player/composition/player-config';
import { debug, log, warn } from './log';
import { SECOND } from './time';

/**
 * Configures the default player config for a player injected by the web extension
 */
export function setupPlayerConfig(
  service: Service,
  customConfig: Pick<
    IPlayerConfig,
    | 'serviceDisplayName'
    | 'onPlayDebounceMs'
    | 'getRootQuery'
    | 'getVideoQuery'
    | 'transformServiceUrl'
    | 'getPlayerOptions'
    | 'doNotReplacePlayer'
  >
): IPlayerConfig {
  const { serviceDisplayName, getRootQuery, getVideoQuery, transformServiceUrl, getPlayerOptions } =
    customConfig;
  return {
    service,
    serviceDisplayName,
    getRootQuery,
    getVideoQuery,
    transformServiceUrl,
    async getPlayerOptions() {
      try {
        const optionGroups = await getPlayerOptions?.();
        log(`${service}.getPlayerOptions`, optionGroups);
        if (optionGroups && optionGroups.length > 0) return optionGroups;
        return undefined;
      } catch (err) {
        warn('Failed to get player options, falling back to undefined');
        return undefined;
      }
    },
    async inferEpisodeInfo() {
      debug(`${service}.inferEpisodeInfo`);
      return await backOff(
        async () => {
          const res = await browser.runtime.sendMessage({
            type: '@anime-skip/inferEpisodeInfo',
          });
          if (res == null) throw Error('Undefined response');
          return res;
        },
        { timeMultiple: 1, startingDelay: SECOND, numOfAttempts: 20 }
      );
    },
    ...initVideoChangeWatcher(getVideoQuery),
    // Listeners need setup in a different content script, and accessible via window
    addKeyDownListener: window.addKeyDownListener,
    removeKeyDownListener: window.removeKeyDownListener,
  };
}

function initVideoChangeWatcher(
  getVideoQuery: IPlayerConfig['getVideoQuery']
): Pick<IPlayerConfig, 'getVideo' | 'onVideoChanged'> {
  const videoCallbacks: ((video: HTMLVideoElement) => void)[] = [];

  function onVideoChanged(callback: (video: HTMLVideoElement) => void): void {
    videoCallbacks.push(callback);
  }

  function getVideo(): HTMLVideoElement {
    return document.querySelector(getVideoQuery()) as HTMLVideoElement;
  }

  // Listen for video changes

  let oldVideoSrc: string | undefined;
  const CHECK_IF_CHANGED_INTERVAL = SECOND;
  setInterval(function checkVideoChanged(): void {
    const newVideo = getVideo();
    if (newVideo?.src !== oldVideoSrc) {
      debug('Video changed, calling callbacks:', {
        oldVideo: oldVideoSrc,
        newVideo: newVideo.src,
        videoCallbacks,
      });
      videoCallbacks.forEach(callback => {
        try {
          callback(newVideo);
        } catch (err) {
          warn('onVideoChangedCallback failed', err);
        }
      });
      oldVideoSrc = newVideo.src;
    }
  }, CHECK_IF_CHANGED_INTERVAL);

  return {
    getVideo,
    onVideoChanged,
  };
}
