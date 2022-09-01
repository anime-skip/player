/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest';
import { createDomFromFile } from '~/utils/testing/jsdom';
import { CrawledEpisodeInfo } from '~types';
import { getEpisodeInfo } from '../parent';

describe('Zoro.to Parent Content Script', () => {
  describe('getEpisodeInfo', () => {
    it.each<[string, CrawledEpisodeInfo]>([
      [
        'parent-show-2022-05-06.gen.html',
        { name: 'Operationã€ˆStrixã€‰', show: 'Spy x Family', number: '1' },
      ],
      [
        'parent-show-2022-07-08.gen.html',
        { name: 'Bloody Night', show: 'Summer Time Rendering', number: '12' },
      ],
    ])('should find the correct episode details for a show: %s', async (file, expected) => {
      const dom = await createDomFromFile(__dirname, file);

      const actual = getEpisodeInfo(dom);

      expect(actual).toEqual(expected);
    });

    it('should find the correct episode details for a movie', async () => {
      const dom = await createDomFromFile(__dirname, 'parent-movie-2022-05-06.gen.html');
      const expected: CrawledEpisodeInfo = {
        name: 'A Silent Voice',
        show: 'A Silent Voice',
      };

      const actual = getEpisodeInfo(dom);

      expect(actual).toEqual(expected);
    });
  });
});
