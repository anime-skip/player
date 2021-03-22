import setupParent from '../setupParent';

setupParent('funimation', {
  getEpisodeInfo() {
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
