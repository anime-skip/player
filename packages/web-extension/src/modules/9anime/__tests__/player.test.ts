/**
 * @vitest-environment jsdom
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createDomFromFile } from '~/utils/testing/jsdom';
import { init9animePlayer } from '../player';

const playerHtmlFiles = [
  'player-show-2022-08-01.gen.html',
  'player-movie-2022-08-01.gen.html',
  'player-show-2022-09-02.html',
];

describe('9anime Player Config', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllTimers();
  });

  describe('getRootQuery', () => {
    it.each(playerHtmlFiles)('should find an element in %s', async file => {
      const dom = await createDomFromFile(__dirname, file);

      const playerConfig = init9animePlayer();
      const root = dom.querySelector(playerConfig.getRootQuery());

      expect(root).toBeTruthy();
    });
  });

  describe('getVideo', () => {
    it.each(playerHtmlFiles)('should find a video element in %s', async file => {
      const dom = await createDomFromFile(__dirname, file);

      const playerConfig = init9animePlayer();
      const video = dom.querySelector(playerConfig.getVideo() as string);

      expect(video).toBeDefined();
      expect(video?.tagName).toBe('VIDEO');
    });
  });

  describe('transformServiceUrl', () => {
    it.each([
      [
        'https://9anime.id/watch/my-isekai-life-i-gained-a-second-character-class-and-became-the-strongest-sage-in-the-world.nzk8/ep-6',
        'https://9anime.to/watch/my-isekai-life-i-gained-a-second-character-class-and-became-the-strongest-sage-in-the-world.nzk8/ep-6',
      ],
      [
        'https://9anime.xyz/watch/your-name.nzk8/ep-6?test',
        'https://9anime.to/watch/your-name.nzk8/ep-6',
      ],
    ])(
      'should change the domain to 9anime.to and remove all query params from %s',
      async (input, expected) => {
        const playerConfig = init9animePlayer();
        const actual = playerConfig.transformServiceUrl?.(input);

        expect(actual).toBe(expected);
      }
    );
  });
});
