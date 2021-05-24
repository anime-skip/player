import setupParent from '../setupParent';

setupParent('crunchyroll', {
  getEpisodeInfo() {
    // X - 06/2021 (Crunchyroll Classic)
    if (document.querySelector('#showmedia_about_media a') != null) {
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

    // 06/2021 - Current
    if (document.querySelector('.erc-current-media-info .show-title-link') != null) {
      console.info('[test] stuff');
      const show = document.querySelector('.erc-current-media-info .show-title-link')?.textContent;
      const episodeAndNumber =
        document.querySelector('.erc-current-media-info .title')?.textContent ?? '';
      const groups = /([0-9]+)\s*-\s*(.+)$/.exec(episodeAndNumber);
      const episode = groups?.[2];
      const number = groups?.[1];
      console.info('[test] stuff', {
        show,
        episodeAndNumber,
        groups: JSON.parse(JSON.stringify(groups)),
        episode,
        number,
      });

      return {
        show: show || undefined,
        name: episode || undefined,
        number: number || undefined,
      };
    }

    return {};
  },
});
