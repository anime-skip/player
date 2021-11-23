import { mocked } from 'ts-jest/utils';
import setupParent from '~/common/utils/setupParent';
import { initFunimation20210926Parent } from '../parent';

jest.mock('~/common/utils/setupParent');
const setupParentMock = mocked(setupParent);

function setupDom(show: string, episode: string, details: string) {
  document.body.innerHTML = `
  <div class="meta-overlay">
    <h1 class="meta-overlay__data-block--title">${show}</h1>
    <p>
      <span data-test="meta-overlay__data-block--episode-details">${details}</span>
      <span data-test="meta-overlay__data-block--content-name">${episode}</span>
    </p>
  </div>`;
}

describe('Parent functionalities', () => {
  beforeAll(() => {
    jest.resetModules();
    initFunimation20210926Parent();
  });

  it('should mock the setupParent function so these tests can be ran', () => {
    expect(setupParentMock).toBeCalledTimes(1);
    expect(setupParentMock).toBeCalledWith('funimation', expect.any(Object));
  });

  let getEpisodeInfo: () => InferredEpisodeInfo | Promise<InferredEpisodeInfo>;

  beforeEach(() => {
    getEpisodeInfo = setupParentMock.mock.calls[0][1].getEpisodeInfo;
  });

  describe('getEpisodeInfo', () => {
    it('should return the show name exactly as the dom element states it', async () => {
      const show = 'RE:Main';
      setupDom(show, 'episode', 'details');

      const actual = await getEpisodeInfo();

      expect(actual).toMatchObject({
        show,
      });
    });

    it('should return the episode name exactly as the dom element states it', async () => {
      const episode = 'Pass! Pass to Me!';
      setupDom('show', episode, 'details');

      const actual = await getEpisodeInfo();

      expect(actual).toMatchObject({
        name: episode,
      });
    });

    it('should parse the episode details and return the season and episode number when available', async () => {
      const details = 'Season\n                1\n                Episode\n                11 - ';
      setupDom('show', 'episode', details);

      const actual = await getEpisodeInfo();

      expect(actual).toMatchObject({
        season: '1',
        number: '11',
      });
    });

    it('should parse the episode details and return the episode number when available', async () => {
      const details = 'Episode\n                11 - ';
      setupDom('show', 'episode', details);

      const actual = await getEpisodeInfo();

      expect(actual).toMatchObject({
        season: undefined,
        number: '11',
      });
    });

    it.each(['Season 1, Episode 4', '1 #4', ''])(
      "should return undefined if it doesn't match one of the predefined text formats",
      async details => {
        setupDom('show', 'episode', details);

        const actual = await getEpisodeInfo();

        expect(actual).toMatchObject({
          season: undefined,
          number: undefined,
        });
      }
    );
  });
});
