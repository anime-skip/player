import { describe, expect, it } from 'vitest';
import { urlPatternMatch } from '../strings';

describe('String Utils', () => {
  describe('urlPatternMatch', () => {
    const validMatches: Array<[string, string]> = [
      ['http://localhost/*', 'http://localhost:7238'],
      ['http://localhost/*', 'http://localhost:7238/'],
      ['http://localhost/*', 'http://localhost:3000/some-path'],
      ['*://*/*', 'https://anime-skip.com/support'],
      ['*://*/*', 'http://www.anime-skip.com'],
      ['*://*/*', 'file:///etc/test'],
      ['*:///*', 'file:///etc/some-path'],
      ['https://static.vrv.co/*', 'https://static.vrv.co/vilos/player.html'],
      ['https://static.vrv.co/*', 'https://static.vrv.co'],
      ['https://vrv.co/*', 'https://vrv.co/watch/G50UZE0WG/takt-opDestiny:Truth-Noise-'],
      ['https://www.funimation.com/player/*', 'https://www.funimation.com/player/vilos.html'],
      ['https://www.funimation.com/*/shows/*', 'https://www.funimation.com/a/shows/b'],
      ['https://www.funimation.com/*', 'https://www.funimation.com/*'],
      ['https://www.funimation.com/v/*', 'https://www.funimation.com/v/player.html'],
      [
        'https://static.crunchyroll.com/vilos-v2/web/vilos/player.html*',
        'https://static.crunchyroll.com/vilos-v2/web/vilos/player.html',
      ],
      [
        'https://static.crunchyroll.com/vilos-v2/web/vilos/player.html*',
        'https://static.crunchyroll.com/vilos-v2/web/vilos/player.html?test=test',
      ],
      ['https://www.crunchyroll.com/*', 'https://www.crunchyroll.com/watch/GJWU2J3V2/Memories'],
      ['https://www.crunchyroll.com/*', 'https://www.crunchyroll.com/watch/asd1234/Test'],
      ['https://beta.crunchyroll.com/*', 'https://beta.crunchyroll.com/watch/GJWU2J3V2/Memories'],
      ['https://beta.crunchyroll.com/*', 'https://beta.crunchyroll.com/watch/asd1234/Test'],
    ];
    const invalidMatches: Array<[string, string]> = [
      ['http://localhost/*', 'http://www.localhost:7238/'],
      ['http://localhost/*', 'http://www.localhost:7238/'],
      ['https://static.vrv.co/a', 'https://static.vrv.co/vilos/player.html'],
      ['https://statics.vrv.co/*', 'https://static.vrv.co/vilos/player.html'],
      ['http://static.vrv.co/*', 'https://static.vrv.co/vilos/player.html'],
      [
        'https://static.crunchyroll.com/vilos-v2/web/vilos/player.html*',
        'https://static.crunchyroll.com/vilos-v2/web/vilos/player.htm',
      ],
      ['https://www.funimation.com/v/*', 'https://www.funimation.com/va'],
      ['https://www.funimation.com/v/*', 'https://www.funimation.com'],
      ['https://www.crunchyroll.com/*', 'https://beta.crunchyroll.com/watch/asd1234/Test'],
    ];

    it.each(validMatches)('%s should match %s', (pattern, url) => {
      expect(urlPatternMatch(pattern, new URL(url))).toBe(true);
    });

    it.each(invalidMatches)('%s should not match %s', (pattern, url) => {
      expect(urlPatternMatch(pattern, new URL(url))).toBe(false);
    });
  });
});
