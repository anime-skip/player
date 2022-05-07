import { JSDOM } from 'jsdom';
import { join } from 'path';
import { setupZoroPlayer } from '../player';
import { InferredEpisodeInfo } from '~types';

async function createDomFromFile(...path: string[]): Promise<typeof document> {
  const dom = await JSDOM.fromFile(join(...path));
  return dom.window.document;
}

const playerConfig = setupZoroPlayer();

const examples = ['player-show-2022-05-06.gen.html', 'player-movie-2022-05-06.gen.html'];

describe('Zoro.to Player Config', () => {
  describe('getRootQuery', () => {
    it.each(examples)('should find an element in %s', async () => {
      const dom = await createDomFromFile(__dirname, 'player-show-2022-05-06.gen.html');

      const root = dom.querySelector(playerConfig.getRootQuery());

      expect(root).toBeDefined();
    });
  });

  describe('getRootQuery', () => {
    it.each(examples)('should find a video element in %s', async () => {
      const dom = await createDomFromFile(__dirname, 'player-show-2022-05-06.gen.html');

      const video = dom.querySelector(playerConfig.getVideoQuery());

      expect(video).toBeDefined();
      expect(video?.tagName).toBe('VIDEO');
    });
  });
});
