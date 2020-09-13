console.log('INJECTED content-scripts/vrv/parent.ts');

import Messenger from '../../common/utils/Messenger';

// VRV doesn't update imediately, so we track the url to know if it worked
let previousUrl: string | undefined;
let previousEpisodeName: string | undefined;

new Messenger<
  ParentMessageTypes,
  ParentMessageListenerMap,
  ParentMessagePayloadMap,
  ParentMessageResponseMap
>('example parent', {
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

async function sleep(ms: number): Promise<void> {
  return new Promise(res => setTimeout(res, ms));
}
