/**
 * @vitest-environment jsdom
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createDomFromFile } from '~/utils/testing/jsdom';
import { initAnimeflixPlayer } from '../player';

const playerHtmlFiles = ['show-2022-10-08.gen.html', 'movie-2022-10-08.gen.html'];

describe('Animeflix Player Config', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllTimers();
  });

  describe('getRootQuery', () => {
    it.each(playerHtmlFiles)('should find an element in %s', async file => {
      const dom = await createDomFromFile(__dirname, file);

      const playerConfig = initAnimeflixPlayer();
      const root = dom.querySelector(playerConfig.getRootQuery());

      expect(root).toBeTruthy();
    });
  });

  describe('getVideo', () => {
    it.each(playerHtmlFiles)('should find a video element in %s', async file => {
      const dom = await createDomFromFile(__dirname, file);

      const playerConfig = initAnimeflixPlayer();
      const video = dom.querySelector(playerConfig.getVideo() as string);

      expect(video).toBeDefined();
      expect(video?.tagName).toBe('VIDEO');
    });
  });
});
