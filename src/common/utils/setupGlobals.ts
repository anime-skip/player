import { browser } from 'webextension-polyfill-ts';
import Utils from '~/common/utils/Utils';

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

  window.getRootQuery = options.getRootQuery;
  window.getVideoQuery = options.getVideoQuery;
  window.transformServiceUrl = options.transformServiceUrl ?? Utils.stripUrl;
  window.getPlayerOptions = async () => {
    const optionGroups = (await options.getPlayerOptions?.()) ?? [];
    console.log(`${service}.getPlayerOptions`, optionGroups);
    return optionGroups;
  };
  window.doNotReplacePlayer = options.doNotReplacePlayer;

  window.inferEpisodeInfo = async (): Promise<InferredEpisodeInfo> => {
    console.debug(`${service}.inferEpisodeInfo`);
    return await browser.runtime.sendMessage({
      type: '@anime-skip/inferEpisodeInfo',
    });
  };

  // Prepare the body so the old player can be hidden
  document.body.classList.add('hide-for-anime-skip');
}
