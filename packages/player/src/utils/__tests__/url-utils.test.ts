import { describe, it, vi, expect } from 'vitest';
import { stripHashAndQuery } from '../url-utils';

describe('URL Utils', () => {
  describe('stripHashAndQuery', () => {
    it('should remove the hash from a URL', () => {
      const expected = 'https://crunchyroll.com/faq';
      const url = `${expected}#some-question`;
      expect(stripHashAndQuery(url)).toEqual(expected);
    });

    it('should remove all query params', () => {
      const expected = 'https://crunchyroll.com/episode/123';
      const url = `${expected}?a=b,c&d=f`;
      expect(stripHashAndQuery(url)).toEqual(expected);
    });

    it('should remove both query params and a hash', () => {
      const expected = 'https://crunchyroll.com/episode/123';
      const url = `${expected}?a=b,c&d=f#test`;
      expect(stripHashAndQuery(url)).toEqual(expected);
    });

    it('should not modify a URL without query params or a hash', () => {
      const url = 'https://crunchyroll.com/episode/123';
      expect(stripHashAndQuery(url)).toEqual(url);
    });
  });
});
