/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest';
import { createDomFromFile } from '~/utils/testing/jsdom';
import { InferredEpisodeInfo } from '~types';
import { getEpisodeInfo } from '../parent';

describe('Animeflix Parent Content Script', () => {
  describe('getEpisodeInfo', () => {
    it.each<[string, InferredEpisodeInfo]>([
      [
        'show-2022-10-08.gen.html',
        {
          name: 'A Quiet Beginning',
          show: 'Boku no Hero Academia 6',
          number: '1',
        },
      ],
    ])('should find the correct episode details for a show: %s', async (file, expected) => {
      const dom = await createDomFromFile(__dirname, file);

      const actual = getEpisodeInfo(dom);

      expect(actual).toEqual(expected);
    });

    it.each([
      [
        'movie-2022-10-08.gen.html',
        {
          // name: 'Your Name.',
          // show: 'Your Name.',
        },
      ],
    ])('should find the correct episode details for a movie', async (file, expected) => {
      const dom = await createDomFromFile(__dirname, file);

      const actual = getEpisodeInfo(dom);

      expect(actual).toEqual(expected);
    });
  });
});
