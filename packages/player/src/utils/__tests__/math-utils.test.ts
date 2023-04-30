import { describe, expect, it } from 'vitest';
import { bounded, floorToNearest } from '../math-utils';

describe('Math Utils', () => {
  describe('bounded', () => {
    it("should return the number if it's within the range", () => {
      const expected = 12;
      const min = 1;
      const max = 24;

      const actual = bounded(expected, min, max);

      expect(actual).toBe(expected);
    });

    it("should return the minimum if it's below the range", () => {
      const input = 0;
      const min = 1;
      const max = 24;

      const actual = bounded(input, min, max);

      expect(actual).toBe(min);
    });

    it("should return the maximum if it's above the range", () => {
      const input = 32;
      const min = 1;
      const max = 24;

      const actual = bounded(input, min, max);

      expect(actual).toBe(max);
    });
  });

  describe('floorToNearest', () => {
    it('should return 12.1 from 12.1 @ 0.1', () => {
      expect(floorToNearest(12.1, 0.1, 1)).toEqual(12.1);
    });

    it('should return 12.19 from 12.1 @ 0.1', () => {
      expect(floorToNearest(12.19, 0.1, 1)).toEqual(12.1);
    });

    it('should return 5 from 5.49 @ 0.5', () => {
      expect(floorToNearest(5.49, 0.5, 1)).toEqual(5);
    });

    it('should return 5.5 from 5.5 @ 0.5', () => {
      expect(floorToNearest(5.5, 0.5, 1));
    });
  });
});
