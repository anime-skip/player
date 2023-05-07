import { describe, expect, it } from 'vitest';
import { getUniqueExistenceMap } from '../array-utils';
import { fakeTimestampFragment } from '../testing/fake-objects';

describe('Array Utils', () => {
  describe('getUniqueExistanceMap', () => {
    it('should return a map of ids to items', () => {
      const array = [
        fakeTimestampFragment({ id: 'a' }),
        fakeTimestampFragment({ id: 'b' }),
      ];
      const expected = {
        a: array[0],
        b: array[1],
      };

      const actual = getUniqueExistenceMap(array, 'id');

      expect(actual).toEqual(expected);
    });

    it('should only include the latest item if the key is shared between items', () => {
      const array = [
        fakeTimestampFragment({ id: '0' }),
        fakeTimestampFragment({ id: '0' }),
      ];
      const expected = {
        0: array[1],
      };

      const actual = getUniqueExistenceMap(array, 'id');

      expect(actual).toEqual(expected);
    });
  });
});
