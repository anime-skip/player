import { cleanupUrl } from '../urls';

describe('URL Utils', () => {
  describe('cleanupUrl', () => {
    it.each([
      ['http://google.com', {}, 'http://google.com'],
      ['http://google.com?key=value', {}, 'http://google.com'],
      [
        'http://google.com?key=value',
        { allowedQueryParams: ['key'] },
        'http://google.com?key=value',
      ],
      ['http://google.com?key=value', { allowedQueryParams: ['test'] }, 'http://google.com'],
      [
        'http://google.com?key=value&key2=value2',
        { allowedQueryParams: ['key'] },
        'http://google.com?key=value',
      ],
      ['http://google.com#example', {}, 'http://google.com'],
      ['http://google.com#example', { keepHash: true }, 'http://google.com#example'],
      ['http://google.com', { keepHash: true }, 'http://google.com'],
      [
        'http://google.com/test?key=1&value=2#example',
        { keepHash: true },
        'http://google.com/test#example',
      ],
      [
        'http://google.com/test?key=1&value=2#example',
        { allowedQueryParams: ['key'] },
        'http://google.com/test?key=1',
      ],
      [
        'http://google.com/test?key=1&value=2#example',
        { allowedQueryParams: ['key', 'value'] },
        'http://google.com/test?key=1&value=2',
      ],
      [
        'http://google.com/test?key=1&value=2#example',
        { keepHash: true, allowedQueryParams: ['value'] },
        'http://google.com/test?value=2#example',
      ],
    ])('should cleanup %s with options %s to %s', (inputUrl, inputOptions, expected) => {
      expect(cleanupUrl(inputUrl, inputOptions)).toEqual(expected);
    });
  });
});
