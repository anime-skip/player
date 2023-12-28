import { initExtensionHelper } from '@/utils/extension-helper';

export default defineContentScript({
  matches: ['*://www.crunchyroll.com/*'],
  allFrames: false,

  main(ctx) {
    initExtensionHelper({
      ctx,
      getEpisodeInfo,
    });
    logger.log(`Initialized ${location.host} helper`);
  },
});

async function getEpisodeInfo() {
  const pageHasLoaded = () =>
    Promise.resolve(
      document.querySelector('.erc-current-media-info') != null ||
        document.querySelector('#showmedia_about_media') != null,
    );
  logger.debug('Waiting for page to load...');
  await waitUntil(pageHasLoaded, 10e3, 1, 200);
  logger.debug('Page has loaded!');

  // X - 06/2021 (Crunchyroll Classic)
  if (document.querySelector('#showmedia_about_media a') != null) {
    const showName = document
      .querySelector('#showmedia_about_media a')
      ?.textContent?.trim();
    const number = /([0-9]+)/.exec(
      document.querySelectorAll('#showmedia_about_media h4')?.[1]
        ?.textContent ?? '',
    )?.[1];
    const dirtyEpisodeName = document
      .querySelector('#showmedia_about_name')
      ?.textContent?.trim();
    const episodeName = !dirtyEpisodeName
      ? undefined
      : dirtyEpisodeName.substring(1, dirtyEpisodeName.length - 1);

    return {
      showName,
      episodeName,
      number,
    };
  }

  // 06/2021 - Current
  const showElement = document.querySelector(
    '.erc-current-media-info .show-title-link',
  );
  if (showElement != null) {
    const showName = showElement?.textContent;
    const episodeAndNumber =
      document.querySelector('.erc-current-media-info .title')?.textContent ??
      '';
    const groups = /([0-9]+)\s*-\s*(.+)$/.exec(episodeAndNumber);
    const episodeName = groups?.[2];
    const number = groups?.[1];

    let season: string | undefined;
    try {
      const int = Array.from(
        document.querySelectorAll("script[type='application/ld+json']"),
      )
        .map((node) => {
          try {
            return JSON.parse(node.textContent ?? '');
          } catch (_) {
            return undefined;
          }
        })
        .find((json) => json?.['@type'] === 'TVEpisode')?.partOfSeason
        ?.seasonNumber;
      if (int != null) season = String(int);
    } catch (err) {
      // noop
    }

    return {
      showName: showName?.trim() || undefined,
      episodeName: episodeName?.trim() || undefined,
      number: number?.trim() || undefined,
      season: season?.trim() || undefined,
    };
  }

  return {};
}
