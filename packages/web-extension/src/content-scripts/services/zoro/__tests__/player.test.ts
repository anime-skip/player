import { JSDOM } from 'jsdom';
import { join } from 'path';
import { setupZoroPlayer } from '../player';

async function createDomFromFile(...path: string[]): Promise<typeof document> {
  const dom = await JSDOM.fromFile(join(...path));
  return dom.window.document;
}

const playerConfig = setupZoroPlayer();

const playerHtmlFiles = ['player-show-2022-05-06.gen.html', 'player-movie-2022-05-06.gen.html'];

describe('Zoro.to Player Config', () => {
  describe('getRootQuery', () => {
    it.each(playerHtmlFiles)('should find an element in %s', async () => {
      const dom = await createDomFromFile(__dirname, 'player-show-2022-05-06.gen.html');

      const root = dom.querySelector(playerConfig.getRootQuery());

      expect(root).toBeDefined();
    });
  });

  describe('getRootQuery', () => {
    it.each(playerHtmlFiles)('should find a video element in %s', async () => {
      const dom = await createDomFromFile(__dirname, 'player-show-2022-05-06.gen.html');

      const video = dom.querySelector(playerConfig.getVideoQuery());

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
      const actual = playerConfig.transformServiceUrl?.(input);

      expect(actual).toBe(expected);
    });
  });
});
