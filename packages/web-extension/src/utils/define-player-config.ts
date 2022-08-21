import { backOff } from 'exponential-backoff';
import { ExternalPlayerConfig } from '~types';
import { SECOND } from '~utils/time';
import { debug, log, warn } from './log';
import WebExtScreenshotController from '../components/WebExtScreenshotController.vue';
import { sendMessage } from '~/utils/web-ext-bridge';
import { createPlayerWebExtStorage } from './player-web-ext-storage';
import UsageStats from './UsageStats';
import { isUrlSupported } from './url-supported';
import { useApiClient } from '~/composables/useApiClient';

/**
 * Configures the default player config for a player injected by the web extension
 */
export function setupPlayerConfig(
  service: Service,
  customConfig: Pick<
    ExternalPlayerConfig,
    | 'serviceDisplayName'
    | 'onPlayDebounceMs'
    | 'getRootQuery'
    | 'getVideoQuery'
    | 'transformServiceUrl'
    | 'getPlaybackOptions'
    | 'doNotReplacePlayer'
  >
): ExternalPlayerConfig {
  const {
    serviceDisplayName,
    onPlayDebounceMs,
    getRootQuery,
    getVideoQuery,
    transformServiceUrl,
    getPlaybackOptions,
  } = customConfig;
  return {
    service,
    serviceDisplayName,
    onPlayDebounceMs,
    getRootQuery,
    getVideoQuery,
    transformServiceUrl,
    async getPlaybackOptions() {
      try {
        const optionGroups = await getPlaybackOptions?.();
        log(`${service}.getPlaybackOptions`, optionGroups);
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
          const res = await sendMessage('@anime-skip/inferEpisodeInfo', undefined);
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
    openAllSettings() {
      void sendMessage('@anime-skip/open-all-settings', undefined);
    },
    screenshotController: WebExtScreenshotController,
    storage: createPlayerWebExtStorage(),
    usageClient: UsageStats,
    useApiClient,
    isUrlSupported,
    getUrl: () => sendMessage('@anime-skip/get-url', undefined),
  };
}

function initVideoChangeWatcher(
  getVideoQuery: ExternalPlayerConfig['getVideoQuery']
): Pick<ExternalPlayerConfig, 'getVideo' | 'onVideoChanged'> {
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
