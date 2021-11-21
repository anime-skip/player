import browser from 'webextension-polyfill';
import Utils from '~/common/utils/Utils';
import Messenger from './Messenger';
import { centerFitVideoBounds, fallbackBound } from './videoBounds';

export default function setupGlobals(
  service: Service,
  options: {
    serviceDisplayName: ServiceDisplayName;
    getRootQuery: typeof window.getRootQuery;
    getVideoQuery: typeof window.getVideoQuery;
    transformServiceUrl?: typeof window.transformServiceUrl;
    getPlayerOptions?: typeof window.getPlayerOptions;
    doNotReplacePlayer?: typeof window.doNotReplacePlayer;
  }
) {
  window.service = service;
  window.serviceDisplayName = options.serviceDisplayName;
  window.doNotReplacePlayer = options.doNotReplacePlayer;

  // Stop setting up listeners if we aren't going to do anything with them
  if (window.doNotReplacePlayer?.()) return;

  window.getRootQuery = options.getRootQuery;
  window.getVideoQuery = options.getVideoQuery;
  window.transformServiceUrl = options.transformServiceUrl ?? Utils.stripUrl;
  window.getPlayerOptions = async () => {
    try {
      const optionGroups = await options.getPlayerOptions?.();
      console.log(`${service}.getPlayerOptions`, optionGroups);
      if (optionGroups && optionGroups.length > 0) return optionGroups;
      return undefined;
    } catch (err) {
      console.warn('Failed to get player options, falling back to undefined');
      return undefined;
    }
  };

  window.inferEpisodeInfo = async (): Promise<InferredEpisodeInfo> => {
    console.debug(`${service}.inferEpisodeInfo`);
    return await browser.runtime.sendMessage({
      type: '@anime-skip/inferEpisodeInfo',
    });
  };

  // Prepare the body so the old player can be hidden
  document.body.classList.add('hide-for-anime-skip', service);

  new Messenger(`${service} player messenger`, {
    // Get the bounds, then center fit the video
    '@anime-skip/player-screenshot-details': async () => {
      const video = window.getVideo?.();

      const boundingRect = video?.getBoundingClientRect();
      const elementBounds = {
        height: fallbackBound(boundingRect?.height),
        left: fallbackBound(boundingRect?.left),
        top: fallbackBound(boundingRect?.top),
        width: fallbackBound(boundingRect?.width),
      };
      const videoWidth = fallbackBound(video?.videoWidth, 1);
      const videoHeight = fallbackBound(video?.videoHeight, 1);
      return centerFitVideoBounds(elementBounds, videoWidth, videoHeight);
    },
  });
}
