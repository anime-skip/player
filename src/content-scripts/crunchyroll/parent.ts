import setupParent from '../setupParent';

setupParent('crunchyroll', {
  getEpisodeInfo() {
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
  },
});
