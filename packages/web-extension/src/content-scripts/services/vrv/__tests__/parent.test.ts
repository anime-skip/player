import { getEpisodeInfo } from '../parent';
import { InferredEpisodeInfo } from '~types';
import { createDomFromFile } from '~/common/utils/testing/jsdom';

describe('VRV Parent Content Script', () => {
  describe('getEpisodeInfo', () => {
    it('should find the correct episode details for a show', async () => {
      const dom = await createDomFromFile(__dirname, 'parent-show-2022-05-07.gen.html');
      const expected: InferredEpisodeInfo = {
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
      const expected: InferredEpisodeInfo = {
        name: 'Fullmetal Alchemist: The Conqueror of Shamballa',
        show: 'Fullmetal Alchemist: The Conqueror of Shamballa',
      };

      const actual = getEpisodeInfo(dom);

      expect(actual).toEqual(expected);
    });
  });
});
