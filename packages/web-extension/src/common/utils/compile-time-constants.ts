/**
 * All the host permission url matchers that run the injected parent scripts
 */
export enum ParentHosts {
  ANIME_SKIP = 'https://anime-skip.com/*',
  ANIME_SKIP_WWW = 'https://www.anime-skip.com/*',
  TEST_SERVICE = 'http://localhost/*',
  CRUNCHYROLL = 'https://www.crunchyroll.com/*',
  CRUNCHYROLL_BETA = 'https://beta.crunchyroll.com/*',
  FUNIMATION = 'https://www.funimation.com/*/shows/*',
  FUNIMATION_20210926 = 'https://www.funimation.com/v/*',
  VRV = 'https://vrv.co/*',
  ZORO = 'https://zoro.to/*',
  NINE_ANIME = 'https://9anime.id/*',
}

/**
 * All the host permission url matchers that run the injected player scripts
 */
export enum PlayerHosts {
  TEST_SERVICE = 'http://localhost/*',
  CRUNCHYROLL = 'https://static.crunchyroll.com/vilos-v2/web/vilos/player.html*',
  FUNIMATION = 'https://www.funimation.com/player/*',
  FUNIMATION_20210926 = 'https://www.funimation.com/v/*',
  VRV = 'https://static.vrv.co/*',
  ZORO = 'https://rapid-cloud.ru/*',
  NINE_ANIME = 'https://vizcloud.site/*',
}

/**
 * All the URL matches to show the action for. This is a superset fo the `ParentHosts` since some of
 * those have a path specified and the action should be shown for the entire website
 */
export const PAGE_ACTION_MATCHES = Object.values(ParentHosts).map(urlPattern => {
  const hostPatternRegex = /^(.*:\/\/[\w.]+)\/.*$/;
  const match = urlPattern.match(hostPatternRegex);

  if (match?.[1]) return match[1] + '/*';
  return urlPattern;
});
