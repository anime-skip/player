import type { ServiceSegment } from '@anime-skip/player';

import { defineSpaContentScript } from '@/utils/define-spa-content-script';
import { initExtensionHelper } from '@/utils/extension-helper';

export default defineSpaContentScript({
  matches: ['*://www.crunchyroll.com/watch/*'],
  allFrames: false,

  main(ctx) {
    initExtensionHelper({
      ctx,
      getEpisodeInfo,
      getServiceSegments,
    });
    logger.log(`Initialized ${location.host} helper`);
  },
});

interface SkipEvent {
  start: number;
  end: number;
}

/**
 * Crunchyroll publishes its own skip events at a public, static URL keyed by
 * the episode's ID (the `/watch/<ID>/...` part of the URL). No auth required.
 */
async function getServiceSegments(): Promise<ServiceSegment[]> {
  const episodeId = /\/watch\/([^/]+)/.exec(location.pathname)?.[1];
  if (!episodeId) return [];

  const res = await fetch(
    `https://static.crunchyroll.com/skip-events/production/${episodeId}.json`,
  );
  // Missing for episodes without skip events
  if (!res.ok) return [];

  const json: Partial<Record<ServiceSegment['type'], SkipEvent>> =
    await res.json();
  const types: ServiceSegment['type'][] = [
    'recap',
    'intro',
    'credits',
    'preview',
  ];
  return types.flatMap((type) => {
    const event = json[type];
    if (typeof event?.start !== 'number' || typeof event?.end !== 'number') {
      return [];
    }
    return [{ type, start: event.start, end: event.end }];
  });
}

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
          } catch {
            return undefined;
          }
        })
        .find((json) => json?.['@type'] === 'TVEpisode')
        ?.partOfSeason?.seasonNumber;
      if (int != null) season = String(int);
    } catch {
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
