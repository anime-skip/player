import { backOff } from 'exponential-backoff';
import { sendMessage } from '~/utils/web-ext-bridge';
import {
  ExternalPlayerConfig,
  InternalPlayerConfig,
  mapToInternalConfig,
  mapToInternalGetVideo,
} from '~types';
import { SECOND } from '~utils/time';
import WebExtScreenshotController from '../components/WebExtScreenshotController.vue';
import { debug, log, warn } from './log';
import { createPlayerWebExtStorage } from './player-web-ext-storage';
import UsageStats from './UsageStats';

const API_CLIENT_ID = 'OB3AfF3fZg9XlZhxtLvhwLhDcevslhnr';
const API_ENV = 'prod';

/**
 * Configures the default player config for a player injected by the web extension
 */
export function defineWebExtPlayerConfig(
  service: Service,
  customConfig: Pick<
    ExternalPlayerConfig,
    | 'serviceDisplayName'
    | 'onPlayDebounceMs'
    | 'getRootQuery'
    | 'getVideo'
    | 'transformServiceUrl'
    | 'getPlaybackOptions'
    | 'doNotReplacePlayer'
    | 'delayMountingUntil'
  >
): ExternalPlayerConfig {
  const {
    serviceDisplayName,
    onPlayDebounceMs,
    getRootQuery,
    getVideo,
    transformServiceUrl,
    getPlaybackOptions,
    delayMountingUntil,
  } = customConfig;
  return {
    service,
    serviceDisplayName,
    onPlayDebounceMs,
    getRootQuery,
    getVideo,
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
    onVideoChanged: initVideoChangeWatcher(getVideo),
    // Listeners need setup in a different content script, and accessible via window
    addKeyDownListener: window.addKeyDownListener,
    removeKeyDownListener: window.removeKeyDownListener,
    openAllSettings: () => sendMessage('@anime-skip/open-all-settings', undefined),
    screenshotController: WebExtScreenshotController,
    storage: createPlayerWebExtStorage(),
    usageClient: UsageStats,
    apiClientId: API_CLIENT_ID,
    apiEnv: API_ENV,
    getUrl: () => sendMessage('@anime-skip/get-url', undefined),
    delayMountingUntil,
  };
}

function initVideoChangeWatcher(
  getVideoExternal: ExternalPlayerConfig['getVideo']
): ExternalPlayerConfig['onVideoChanged'] {
  const videoCallbacks: ((video: HTMLVideoElement) => void)[] = [];
  const getVideo = mapToInternalGetVideo(getVideoExternal);

  function onVideoChanged(callback: (video: HTMLVideoElement) => void): void {
    videoCallbacks.push(callback);
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
      // Wait for all other events to fire in the current task before notifying the callbacks
      // This was neccessary for animeflix
      setTimeout(() => {
        videoCallbacks.forEach(callback => {
          try {
            callback(newVideo);
          } catch (err) {
            warn('onVideoChangedCallback failed', err);
          }
        });
        oldVideoSrc = newVideo.src;
      });
    }
  }, CHECK_IF_CHANGED_INTERVAL);

  return onVideoChanged;
}

const notImplemented = (): any => {
  throw Error('Not implemented');
};

export function defineNonPlayerConfig(): InternalPlayerConfig {
  return mapToInternalConfig({
    apiClientId: API_CLIENT_ID,
    getUrl: () => sendMessage('@anime-skip/get-url', undefined),
    apiEnv: API_ENV,
    getRootQuery: notImplemented,
    getVideo: notImplemented,
    inferEpisodeInfo: notImplemented,
    onVideoChanged: notImplemented,
    openAllSettings: () => sendMessage('@anime-skip/open-all-settings', undefined),
    screenshotController: WebExtScreenshotController,
    service: 'extension-page',
    serviceDisplayName: 'Extension Page',
    storage: createPlayerWebExtStorage(),
    usageClient: UsageStats,
    addKeyDownListener: notImplemented,
    removeKeyDownListener: notImplemented,
  });
}
