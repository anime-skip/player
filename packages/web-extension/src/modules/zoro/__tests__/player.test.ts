/**
 * @vitest-environment jsdom
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createDomFromFile } from '~/utils/testing/jsdom';
import { setupZoroPlayer } from '../player';

const playerHtmlFiles = [
  'player-show-2022-05-06.gen.html',
  'player-movie-2022-05-06.gen.html',
  'player-show-2022-07-08.gen.html',
];

describe('Zoro.to Player Config', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllTimers();
  });

  describe('getRootQuery', () => {
    it.each(playerHtmlFiles)('should find an element in %s', async () => {
      const dom = await createDomFromFile(__dirname, 'player-show-2022-05-06.gen.html');

      const playerConfig = setupZoroPlayer();
      const root = dom.querySelector(playerConfig.getRootQuery());

      expect(root).toBeDefined();
    });
  });

  describe('getRootQuery', () => {
    it.each(playerHtmlFiles)('should find a video element in %s', async () => {
      const dom = await createDomFromFile(__dirname, 'player-show-2022-05-06.gen.html');

      const playerConfig = setupZoroPlayer();
      const video = dom.querySelector(playerConfig.getVideo() as string);

      expect(video).toBeDefined();
      expect(video?.tagName).toBe('VIDEO');
    });
  });

  describe('transformServiceUrl', () => {
    it.each([
      [
        'https://zoro.to/watch/spy-x-family-17977?ep=89506',
        'https://zoro.to/watch/spy-x-family-17977?ep=89506',
      ],
      [
        'https://zoro.to/watch/spy-x-family-17977?ep=89506&test',
        'https://zoro.to/watch/spy-x-family-17977?ep=89506',
      ],
      ['https://zoro.to/watch/spy-x-family-17977', 'https://zoro.to/watch/spy-x-family-17977'],
    ])('should remove all query params other than ep from %s', async (input, expected) => {
      const playerConfig = setupZoroPlayer();
      const actual = playerConfig.transformServiceUrl?.(input);

      expect(actual).toBe(expected);
    });
  });
});
