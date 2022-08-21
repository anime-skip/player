/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest';
import { createDomFromFile } from '~/utils/testing/jsdom';
import { initVrvPlayer } from '../player';

const playerConfig = initVrvPlayer();

const playerHtmlFiles = ['player-show-2022-05-07.gen.html', 'player-movie-2022-05-07.gen.html'];

describe('VRV Player Config', () => {
  describe('getRootQuery', () => {
    it.each(playerHtmlFiles)('should find an element in %s', async () => {
      const dom = await createDomFromFile(__dirname, 'player-show-2022-05-07.gen.html');

      const root = dom.querySelector(playerConfig.getRootQuery());

      expect(root).toBeDefined();
    });
  });

  describe('getRootQuery', () => {
    it.each(playerHtmlFiles)('should find a video element in %s', async () => {
      const dom = await createDomFromFile(__dirname, 'player-show-2022-05-07.gen.html');

      const video = dom.querySelector(playerConfig.getVideo() as string);

      expect(video).toBeDefined();
      expect(video?.tagName).toBe('VIDEO');
    });
  });

  describe('transformServiceUrl', () => {
    it.each([
      [
        'https://vrv.co/watch/G31UX3P3J/World-Trigger:Resolution',
        'https://vrv.co/watch/G31UX3P3J/World-Trigger:Resolution',
      ],
      [
        'https://vrv.co/watch/G31UX3P3J/World-Trigger:Resolution?test',
        'https://vrv.co/watch/G31UX3P3J/World-Trigger:Resolution',
      ],
      [
        'https://vrv.co/watch/G31UX3P3J/World-Trigger:Resolution#test',
        'https://vrv.co/watch/G31UX3P3J/World-Trigger:Resolution',
      ],
    ])('should remove all query params other than ep from %s', async (input, expected) => {
      const actual = playerConfig.transformServiceUrl?.(input);

      expect(actual).toBe(expected);
    });
  });
});
