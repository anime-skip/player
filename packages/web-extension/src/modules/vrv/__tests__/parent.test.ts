/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest';
import { createDomFromFile } from '~/utils/testing/jsdom';
import { CrawledEpisodeInfo } from '~types';
import { getEpisodeInfo } from '../parent';

describe('VRV Parent Content Script', () => {
  describe('getEpisodeInfo', () => {
    it('should find the correct episode details for a show', async () => {
      const dom = await createDomFromFile(__dirname, 'parent-show-2022-05-07.gen.html');
      const expected: CrawledEpisodeInfo = {
        name: 'Resolution',
        number: '14',
        season: '3',
        show: 'World Trigger',
      };

      const actual = getEpisodeInfo(dom);

      expect(actual).toEqual(expected);
    });

    it('should find the correct episode details for a movie', async () => {
      const dom = await createDomFromFile(__dirname, 'parent-movie-2022-05-07.gen.html');
      const expected: CrawledEpisodeInfo = {
        name: 'Fullmetal Alchemist: The Conqueror of Shamballa',
        show: 'Fullmetal Alchemist: The Conqueror of Shamballa',
      };

      const actual = getEpisodeInfo(dom);

      expect(actual).toEqual(expected);
    });
  });
});
