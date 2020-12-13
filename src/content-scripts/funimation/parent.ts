console.log('INJECTED content-scripts/funimation/parent.ts');

import Messenger from '@/common/utils/Messenger';

new Messenger<
  ParentMessageTypes,
  ParentMessageListenerMap,
  ParentMessagePayloadMap,
  ParentMessageResponseMap
>('funimation parent', {
  '@anime-skip/inferEpisodeInfo': async (): Promise<InferredEpisodeInfo> => {
    const show = document.querySelector('.video-title a')?.textContent ?? undefined;
    const number = document
      .querySelector('.video-title')
      ?.textContent?.replace(show || '', '')
      ?.replace('Episode', '')
      ?.trim();
    const name = document.querySelector('h2.episode-headline')?.textContent ?? undefined;
    return {
      show,
      number,
      name,
    };
  },
});
