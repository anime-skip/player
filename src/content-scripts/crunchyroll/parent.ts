console.log('INJECTED content-scripts/crunchyroll/parent.ts');

import Messenger from '@/common/utils/Messenger';

async function sleep(ms: number): Promise<void> {
  return new Promise(res => setTimeout(res, ms));
}

function getEpisodeInfo(): InferredEpisodeInfo {
  const show = document.querySelector('#showmedia_about_media a')?.textContent?.trim();
  const number = /([0-9]+)/.exec(
    document.querySelectorAll('#showmedia_about_media h4')?.[1]?.textContent ?? ''
  )?.[1];
  const dirtyName = document.querySelector('#showmedia_about_name')?.textContent?.trim();
  const name = !dirtyName ? undefined : dirtyName.substring(1, dirtyName.length - 1);

  return {
    show,
    name,
    number,
  };
}

// Crunchyroll doesn't update immediately, so we track the url to know if we should be expecting a different episode
let previousUrl: string | undefined;
let previousEpisodeName: string | undefined;

new Messenger<
  ParentMessageTypes,
  ParentMessageListenerMap,
  ParentMessagePayloadMap,
  ParentMessageResponseMap
>('crunchyroll parent', {
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
