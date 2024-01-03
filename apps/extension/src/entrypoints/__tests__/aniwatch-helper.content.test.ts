/**
 * @vitest-environment happy-dom
 */
import { describe, expect, it } from 'vitest';
import { createDomFromFile } from '~/utils/testing/dom';
import { getEpisodeInfo } from '../aniwatch-helper.content';
import { InferredEpisodeInfo } from '@anime-skip/player';

describe('Aniwatch (previously Zoro.to) Helper', () => {
  describe('getEpisodeInfo', () => {
    it.each<[string, InferredEpisodeInfo]>([
      [
        'fixtures/2022-05-06-zoro-show.gen.html',
        {
          episodeName: 'Operation〈Strix〉',
          showName: 'Spy x Family',
          number: '1',
        },
      ],
      [
        'fixtures/2022-07-08-zoro-show.gen.html',
        {
          episodeName: 'Bloody Night',
          showName: 'Summer Time Rendering',
          number: '12',
        },
      ],
      [
        'fixtures/2024-01-03-aniwatch-show.gen.html',
        {
          episodeName: 'Episode 1',
          showName: 'Classroom of the Elite III',
          number: '1',
        },
      ],
    ])(
      'should find the correct episode details for a show: %s',
      async (file, expected) => {
        const dom = await createDomFromFile(__dirname, file);

        const actual = getEpisodeInfo(dom);

        expect(actual).toEqual(expected);
      },
    );

    it.each<[string, InferredEpisodeInfo]>([
      [
        'fixtures/2022-05-06-zoro-movie.gen.html',
        {
          episodeName: 'A Silent Voice',
          showName: 'A Silent Voice',
        },
      ],
      [
        'fixtures/2024-01-03-aniwatch-movie.gen.html',
        {
          episodeName: 'Psycho-Pass Movie: Providence',
          showName: 'Psycho-Pass Movie: Providence',
        },
      ],
    ])(
      'should find the correct episode details for a movie: %s, %s',
      async (filename, expected) => {
        const dom = await createDomFromFile(__dirname, filename);

        const actual = getEpisodeInfo(dom);

        expect(actual).toEqual(expected);
      },
    );
  });
});
