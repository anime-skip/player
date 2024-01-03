/**
 * @vitest-environment happy-dom
 */
import { describe, expect, it, vi } from 'vitest';
import { createDomFromFile } from '~/utils/testing/dom';
import { getEpisodeInfo } from '../aniwave-helper.content';
import { InferredEpisodeInfo } from '@anime-skip/player';

describe('Aniwave (previously 9anime) Helper', () => {
  describe('getEpisodeInfo', () => {
    it.each<[string, InferredEpisodeInfo]>([
      [
        'fixtures/2022-08-01-9anime-show.gen.html',
        {
          episodeName: 'Infiltrating an Ominous Village',
          showName:
            'My Isekai Life: I Gained a Second Character Class and Became the Strongest Sage in the World!',
          number: '6',
        },
      ],
      [
        'fixtures/2023-12-30-aniwave-show.gen.html',
        {
          episodeName: 'The Darkness of the Shut-in Vampire Princess',
          showName: 'The Vexations of a Shut-In Vampire Princess',
          number: '3',
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
        'fixtures/2022-08-01-9anime-movie.gen.html',
        {
          episodeName: 'Your Name.',
          showName: 'Your Name.',
        },
      ],
      [
        'fixtures/2023-12-30-aniwave-movie.gen.html',
        {
          episodeName:
            'Sword Art Online the Movie -Progressive- Scherzo of Deep Night',
          showName:
            'Sword Art Online the Movie -Progressive- Scherzo of Deep Night',
        },
      ],
    ])(
      'should find the correct episode details for a movie: %s',
      async (filename, expected) => {
        const dom = await createDomFromFile(__dirname, filename);

        const actual = getEpisodeInfo(dom);

        expect(actual).toEqual(expected);
      },
    );
  });
});
