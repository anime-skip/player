import { describe, expect, it } from 'vitest';
import * as Api from '../../api';
import EpisodeUtils from '../episode-utils';

describe('Episode Utils', () => {
  describe('seasonAndNumberDisplay', () => {
    it('should return all the values when they are passed', () => {
      const input = {
        season: '0',
        number: '0',
        absoluteNumber: '0',
      } as Api.EpisodeSearchResult;
      const expected = 'Season 0, Episode 0 (#0)';

      const actual = EpisodeUtils.seasonAndNumberDisplay(input);

      expect(actual).toBe(expected);
    });

    it("should return the season and number when only the absolute number isn't passed", () => {
      const input = {
        season: '0',
        number: '0',
        absoluteNumber: undefined,
      } as Api.EpisodeSearchResult;
      const expected = 'Season 0, Episode 0';

      const actual = EpisodeUtils.seasonAndNumberDisplay(input);

      expect(actual).toBe(expected);
    });

    it("should return the season and absolute number when the number isn't passed", () => {
      const input = {
        season: '0',
        number: undefined,
        absoluteNumber: '0',
      } as Api.EpisodeSearchResult;
      const expected = 'Season 0 (#0)';

      const actual = EpisodeUtils.seasonAndNumberDisplay(input);

      expect(actual).toBe(expected);
    });

    it('should return the season when it is the only thing passed', () => {
      const input = {
        season: '0',
        number: undefined,
        absoluteNumber: undefined,
      } as Api.EpisodeSearchResult;
      const expected = 'Season 0';

      const actual = EpisodeUtils.seasonAndNumberDisplay(input);

      expect(actual).toBe(expected);
    });

    it('should return the number when it is the only thing passed', () => {
      const input = {
        season: undefined,
        number: '0',
        absoluteNumber: undefined,
      } as Api.EpisodeSearchResult;
      const expected = 'Episode 0';

      const actual = EpisodeUtils.seasonAndNumberDisplay(input);

      expect(actual).toBe(expected);
    });

    it('should return the absolute number when it is the only thing passed', () => {
      const input = {
        season: undefined,
        number: undefined,
        absoluteNumber: '0',
      } as Api.EpisodeSearchResult;
      const expected = 'Episode #0';

      const actual = EpisodeUtils.seasonAndNumberDisplay(input);

      expect(actual).toBe(expected);
    });
  });
});
