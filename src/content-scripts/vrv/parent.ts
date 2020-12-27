console.log('INJECTED content-scripts/vrv/parent.ts');

import Messenger from '@/common/utils/Messenger';

async function sleep(ms: number): Promise<void> {
  return new Promise(res => setTimeout(res, ms));
}

function getEpisodeInfo(): InferredEpisodeInfo {
  const show = document.querySelector('.episode-info span.series')?.textContent || undefined;
  const fullSeason = document.querySelector('.episode-info span.season');
  const season = fullSeason?.textContent?.replace('SEASON', '')?.trim();

  const episodeSplit = document.querySelector('h2.title')?.textContent?.split(' - ') || [];
  const name = episodeSplit.length === 2 ? episodeSplit[1] : episodeSplit[0];
  const fullNumber = episodeSplit.length === 2 ? episodeSplit[0] : undefined;
  const number = fullNumber?.replace('E', '')?.trim();

  return {
    show,
    season,
    name,
    number,
  };
}

// VRV doesn't update immediately, so we track the url to know if we should be expecting a different episode
let previousUrl: string | undefined;
let previousEpisodeName: string | undefined;

new Messenger<
  ParentMessageTypes,
  ParentMessageListenerMap,
  ParentMessagePayloadMap,
  ParentMessageResponseMap
>('vrv parent', {
  '@anime-skip/inferEpisodeInfo': async () => {
    const currentUrl: string = window.location.href;
    let episode: InferredEpisodeInfo;

    if (previousUrl != null && currentUrl !== previousUrl) {
      // Wait for a little bit, then loop until the episode name is different
      await sleep(400);
      do {
        await sleep(100);
        episode = getEpisodeInfo();
      } while (episode.name === previousEpisodeName);
    } else {
      episode = getEpisodeInfo();
    }

    previousUrl = currentUrl;
    previousEpisodeName = episode.name;
    return episode;
  },
});
