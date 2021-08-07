import Utils from '@/common/utils/Utils';

export default function setupGlobals(
  service: Service,
  options: {
    serviceDisplayName: ServiceDisplayName;
    getRootQuery: NodeJS.Global['getRootQuery'];
    getVideoQuery: NodeJS.Global['getVideoQuery'];
    transformServiceUrl?: NodeJS.Global['transformServiceUrl'];
    getPlayerOptions?: NodeJS.Global['getPlayerOptions'];
    doNotReplacePlayer?: NodeJS.Global['doNotReplacePlayer'];
  }
) {
  console.log(`INJECTED content-scripts/${service}/globals.ts`);

  global.service = service;
  global.serviceDisplayName = options.serviceDisplayName;

  global.getRootQuery = options.getRootQuery;
  global.getVideoQuery = options.getVideoQuery;
  global.transformServiceUrl = options.transformServiceUrl ?? Utils.stripUrl;
  global.getPlayerOptions = async () => {
    const optionGroups = (await options.getPlayerOptions?.()) ?? [];
    console.log(`${service}.getPlayerOptions`, optionGroups);
    return optionGroups;
  };
  global.doNotReplacePlayer = options.doNotReplacePlayer;

  global.inferEpisodeInfo = async (): Promise<InferredEpisodeInfo> => {
    console.debug(`${service}.inferEpisodeInfo`);
    return await browser.runtime.sendMessage({
      type: '@anime-skip/inferEpisodeInfo',
    });
  };

  // Prepare the body so the old player can be hidden
  document.body.classList.add('hide-for-anime-skip');
}
