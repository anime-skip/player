/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest';
import { createDomFromFile } from '~/utils/testing/jsdom';
import { InferredEpisodeInfo } from '~types';
import { getEpisodeInfo } from '../parent';

describe('9anime Parent Content Script', () => {
  describe('getEpisodeInfo', () => {
    it.each<[string, InferredEpisodeInfo]>([
      [
        'parent-show-2022-08-01.gen.html',
        {
          name: 'Infiltrating an Ominous Village',
          show: 'My Isekai Life: I Gained a Second Character Class and Became the Strongest Sage in the World!',
          number: '6',
        },
      ],
    ])('should find the correct episode details for a show: %s', async (file, expected) => {
      const dom = await createDomFromFile(__dirname, file);

      const actual = getEpisodeInfo(dom);

      expect(actual).toEqual(expected);
    });

    it('should find the correct episode details for a movie', async () => {
      const dom = await createDomFromFile(__dirname, 'parent-movie-2022-08-01.gen.html');
      const expected: InferredEpisodeInfo = {
        name: 'Your Name.',
        show: 'Your Name.',
      };

      const actual = getEpisodeInfo(dom);

      expect(actual).toEqual(expected);
    });
  });
});
