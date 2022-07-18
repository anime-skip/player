import { describe, expect, it } from 'vitest';
import * as Api from '../../api';
import GeneralUtils from '../GeneralUtils';

describe('Utils', () => {
  describe('stripUrl()', () => {
    it('should only return the protocol, host, and path of the input so that all urls are standardized', () => {
      expect(GeneralUtils.stripUrl('https://anime-skip.com')).toBe('https://anime-skip.com/');
      expect(GeneralUtils.stripUrl('https://anime-skip.com/test')).toBe(
        'https://anime-skip.com/test'
      );
      expect(GeneralUtils.stripUrl('https://anime-skip.com/test#heading')).toBe(
        'https://anime-skip.com/test'
      );
      expect(GeneralUtils.stripUrl('https://anime-skip.com/test?query=param')).toBe(
        'https://anime-skip.com/test'
      );
      expect(GeneralUtils.stripUrl('https://anime-skip.com/test#heading?query=param')).toBe(
        'https://anime-skip.com/test'
      );

      expect(
        GeneralUtils.stripUrl(
          'https://www.funimation.com/shows/the-irregular-at-magic-high-school/yokohama-disturbance-part-ii/uncut/?lang=japanese&qid=undefined'
        )
      ).toBe(
        'https://www.funimation.com/shows/the-irregular-at-magic-high-school/yokohama-disturbance-part-ii/uncut/'
      );
    });
  });

  describe('formatSeconds()', () => {
    describe('includeDecimals = true', () => {
      it('should return the correct minutes, seconds, and decimal seconds', () => {
        expect(GeneralUtils.formatSeconds(100.247, true)).toBe('1:40.25');
        expect(GeneralUtils.formatSeconds(290, true)).toBe('4:50.00');
        expect(GeneralUtils.formatSeconds(0, true)).toBe('0:00.00');
        expect(GeneralUtils.formatSeconds(20.0, true)).toBe('0:20.00');
        expect(GeneralUtils.formatSeconds(5.6, true)).toBe('0:05.60');
        expect(GeneralUtils.formatSeconds(7.03, true)).toBe('0:07.03');
        expect(GeneralUtils.formatSeconds(65.3, true)).toBe('1:05.30');
        expect(GeneralUtils.formatSeconds(65.3, true)).toBe('1:05.30');
      });

      it('should floor the decimal only when it rounds up to the next whole number', () => {
        expect(GeneralUtils.formatSeconds(65.996, true)).toBe('1:05.99');
      });
    });

    describe('includeDecimals = false', () => {
      it('should return the correct minutes and floored seconds', () => {
        expect(GeneralUtils.formatSeconds(100.247, false)).toBe('1:40');
        expect(GeneralUtils.formatSeconds(290, false)).toBe('4:50');
        expect(GeneralUtils.formatSeconds(0, false)).toBe('0:00');
        expect(GeneralUtils.formatSeconds(20.0, false)).toBe('0:20');
        expect(GeneralUtils.formatSeconds(5.6, false)).toBe('0:05');
        expect(GeneralUtils.formatSeconds(65.3, false)).toBe('1:05');
        expect(GeneralUtils.formatSeconds(65.996, false)).toBe('1:05');
      });
    });
  });

  describe('padLeft()', () => {
    it('should pad the number with zeros', () => {
      expect(GeneralUtils.padLeft(123, 0)).toBe('123');
      expect(GeneralUtils.padLeft(1, 0)).toBe('1');
      expect(GeneralUtils.padLeft(123, 2)).toBe('123');
      expect(GeneralUtils.padLeft(1, 2)).toBe('01');
      expect(GeneralUtils.padLeft(0, 2)).toBe('00');

      expect(GeneralUtils.padLeft('test', 6, ' ')).toBe('  test');
      expect(GeneralUtils.padLeft('test', 6, '-')).toBe('--test');
      expect(GeneralUtils.padLeft('test', 4, ' ')).toBe('test');
      expect(GeneralUtils.padLeft('test', 1, ' ')).toBe('test');
    });
  });

  describe('padRight()', () => {
    it('should pad the number with zeros', () => {
      expect(GeneralUtils.padRight(123, 0)).toBe('123');
      expect(GeneralUtils.padRight(1, 0)).toBe('1');
      expect(GeneralUtils.padRight(123, 2)).toBe('123');
      expect(GeneralUtils.padRight(1, 2)).toBe('10');
      expect(GeneralUtils.padRight(0, 2)).toBe('00');

      expect(GeneralUtils.padRight('test', 6, ' ')).toBe('test  ');
      expect(GeneralUtils.padRight('test', 6, '-')).toBe('test--');
      expect(GeneralUtils.padRight('test', 4, ' ')).toBe('test');
      expect(GeneralUtils.padRight('test', 1, ' ')).toBe('test');
    });
  });

  describe('arrayIncludes()', () => {
    const array = [
      { id: '1', name: 'item 1' },
      { id: '2', name: 'item 2' },
      { id: '3', name: 'item 3' },
    ];

    it('should return true when there is a matching value at the key', () => {
      expect(GeneralUtils.arrayIncludes(array, 'id', { id: '1' })).toBeTruthy();
    });

    it('should return false when there is NOT a matching value at the key', () => {
      expect(GeneralUtils.arrayIncludes(array, 'name', { id: '4', name: 'item 4' })).toBeFalsy();
    });
  });

  describe('computeListDiffs', () => {
    interface Item {
      id: number;
      value?: number;
    }
    const getId = (item: Item) => item.id;
    const compareNeedsUpdated = (newItem: Item, oldItem: Item) => newItem.value !== oldItem.value;

    it('should create all the new items when there are no old items', () => {
      const oldItems: Item[] = [];
      const newItems: Item[] = [{ id: 1 }, { id: 2 }];

      const actual = GeneralUtils.computeListDiffs(newItems, oldItems, getId, compareNeedsUpdated);
      const expected: ReturnType<typeof GeneralUtils.computeListDiffs> = {
        toCreate: [{ id: 1 }, { id: 2 }],
        toUpdate: [],
        toDelete: [],
        toLeave: [],
      };

      expect(actual).toEqual(expected);
    });

    it('should delete all the old items when there are no new items', () => {
      const oldItems: Item[] = [{ id: 1 }, { id: 2 }];
      const newItems: Item[] = [];

      const actual = GeneralUtils.computeListDiffs(newItems, oldItems, getId, compareNeedsUpdated);
      const expected: ReturnType<typeof GeneralUtils.computeListDiffs> = {
        toCreate: [],
        toUpdate: [],
        toDelete: [{ id: 1 }, { id: 2 }],
        toLeave: [],
      };

      expect(actual).toEqual(expected);
    });

    it('should leave items that are unchanged as is', () => {
      const oldItems: Item[] = [
        { id: 1, value: 10 },
        { id: 2, value: 20 },
      ];
      const newItems: Item[] = [
        { id: 1, value: 10 },
        { id: 2, value: 20 },
      ];

      const actual = GeneralUtils.computeListDiffs(newItems, oldItems, getId, compareNeedsUpdated);
      const expected: ReturnType<typeof GeneralUtils.computeListDiffs> = {
        toCreate: [],
        toUpdate: [],
        toDelete: [],
        toLeave: [
          { id: 1, value: 10 },
          { id: 2, value: 20 },
        ],
      };

      expect(actual).toEqual(expected);
    });

    it('should update all the values to the new values if the lists have all the same values, but different values we care about', () => {
      const oldItems: Item[] = [
        { id: 1, value: 10 },
        { id: 2, value: 20 },
      ];
      const newItems: Item[] = [
        { id: 1, value: 30 },
        { id: 2, value: 40 },
      ];

      const actual = GeneralUtils.computeListDiffs(newItems, oldItems, getId, compareNeedsUpdated);
      const expected: ReturnType<typeof GeneralUtils.computeListDiffs> = {
        toCreate: [],
        toUpdate: [
          { id: 1, value: 30 },
          { id: 2, value: 40 },
        ],
        toDelete: [],
        toLeave: [],
      };

      expect(actual).toEqual(expected);
    });

    it('should return a combination of create, update, and delete for a complex pair of lists', () => {
      const oldItems: Item[] = [
        { id: 1, value: 10 },
        { id: 2, value: 20 },
        { id: 3, value: 30 },
        { id: 4, value: 40 },
      ];
      const newItems: Item[] = [
        { id: 3, value: 30 },
        { id: 4, value: -40 },
        { id: 5, value: 50 },
      ];

      const actual = GeneralUtils.computeListDiffs(newItems, oldItems, getId, compareNeedsUpdated);
      const expected: ReturnType<typeof GeneralUtils.computeListDiffs> = {
        toCreate: [{ id: 5, value: 50 }],
        toUpdate: [{ id: 4, value: -40 }],
        toDelete: [
          { id: 1, value: 10 },
          { id: 2, value: 20 },
        ],
        toLeave: [{ id: 3, value: 30 }],
      };

      expect(actual).toEqual(expected);
    });
  });

  describe('computeTimestampDiffs()', () => {
    it('should return the correct toCreate', () => {
      const oldTimestamps: Api.Timestamp[] = [];
      const newTimestamps: Api.AmbiguousTimestamp[] = [
        { id: '0', at: 0, typeId: 'intro', source: Api.TimestampSource.ANIME_SKIP },
      ];

      const expectedToCreate: Api.AmbiguousTimestamp[] = newTimestamps;
      const expectedToUpdate: Api.Timestamp[] = [];
      const expectedToDelete: Api.Timestamp[] = [];

      const { toCreate, toUpdate, toDelete } = GeneralUtils.computeTimestampDiffs(
        oldTimestamps,
        newTimestamps
      );

      expect(toCreate).toEqual(expectedToCreate);
      expect(toUpdate).toEqual(expectedToUpdate);
      expect(toDelete).toEqual(expectedToDelete);
    });

    it('should return the correct toUpdate containing only updated timestamps', () => {
      const oldTimestamps: Api.Timestamp[] = [
        { id: '0', at: 0, typeId: 'intro', source: Api.TimestampSource.ANIME_SKIP },
        { id: '1', at: 1, typeId: 'intro', source: Api.TimestampSource.ANIME_SKIP },
        { id: '2', at: 2, typeId: 'intro', source: Api.TimestampSource.ANIME_SKIP },
      ];
      const newTimestamps: Api.AmbiguousTimestamp[] = [
        { id: '0', at: 0, typeId: 'branding', source: Api.TimestampSource.ANIME_SKIP },
        { id: '1', at: 1, typeId: 'intro', source: Api.TimestampSource.ANIME_SKIP },
        { id: '2', at: 3, typeId: 'intro', source: Api.TimestampSource.ANIME_SKIP },
      ];

      const expectedToCreate: Api.AmbiguousTimestamp[] = [];
      const expectedToUpdate: Api.Timestamp[] = [
        { id: '0', at: 0, typeId: 'branding', source: Api.TimestampSource.ANIME_SKIP },
        { id: '2', at: 3, typeId: 'intro', source: Api.TimestampSource.ANIME_SKIP },
      ];
      const expectedToDelete: Api.Timestamp[] = [];

      const { toCreate, toUpdate, toDelete } = GeneralUtils.computeTimestampDiffs(
        oldTimestamps,
        newTimestamps
      );

      expect(toCreate).toEqual(expectedToCreate);
      expect(toUpdate).toEqual(expectedToUpdate);
      expect(toDelete).toEqual(expectedToDelete);
    });

    it('should return the correct toDelete', () => {
      const oldTimestamps: Api.Timestamp[] = [
        { id: '0', at: 0, typeId: 'branding', source: Api.TimestampSource.ANIME_SKIP },
      ];
      const newTimestamps: Api.AmbiguousTimestamp[] = [];

      const expectedToCreate: Api.AmbiguousTimestamp[] = [];
      const expectedToUpdate: Api.Timestamp[] = [];
      const expectedToDelete: Api.Timestamp[] = oldTimestamps;

      const { toCreate, toUpdate, toDelete } = GeneralUtils.computeTimestampDiffs(
        oldTimestamps,
        newTimestamps
      );

      expect(toCreate).toEqual(expectedToCreate);
      expect(toUpdate).toEqual(expectedToUpdate);
      expect(toDelete).toEqual(expectedToDelete);
    });

    it('should return the correct toCreate, toUpdate (only updated items), toDelete for a complete example', () => {
      const oldTimestamps: Api.Timestamp[] = [
        { id: '0', at: 0, typeId: 'branding', source: Api.TimestampSource.ANIME_SKIP },
        { id: '1', at: 2, typeId: 'recap', source: Api.TimestampSource.ANIME_SKIP },
        { id: '2', at: 4, typeId: 'intro', source: Api.TimestampSource.BETTER_VRV },
        { id: '3', at: 6, typeId: 'cannon', source: Api.TimestampSource.ANIME_SKIP },
        { id: '4', at: 8, typeId: 'credits', source: Api.TimestampSource.ANIME_SKIP },
        { id: '5', at: 8, typeId: 'filler', source: Api.TimestampSource.ANIME_SKIP },
      ];
      const newTimestamps: Api.AmbiguousTimestamp[] = [
        { id: '0', at: 1, typeId: 'filler', source: Api.TimestampSource.ANIME_SKIP },
        { id: '1', at: 2, typeId: 'recap', source: Api.TimestampSource.ANIME_SKIP },
        { id: '2', at: 3, typeId: 'intro', source: Api.TimestampSource.BETTER_VRV },
        { id: '6', at: 4, typeId: 'filler', source: Api.TimestampSource.ANIME_SKIP },
        { id: '3', at: 6, typeId: 'cannon', source: Api.TimestampSource.ANIME_SKIP },
        { id: '7', at: 7, typeId: 'credits', source: Api.TimestampSource.ANIME_SKIP },
        { id: '8', at: 8, typeId: 'preview', source: Api.TimestampSource.ANIME_SKIP },
      ];

      const expectedToCreate: Api.AmbiguousTimestamp[] = [
        { id: '6', at: 4, typeId: 'filler', source: Api.TimestampSource.ANIME_SKIP },
        { id: '7', at: 7, typeId: 'credits', source: Api.TimestampSource.ANIME_SKIP },
        { id: '8', at: 8, typeId: 'preview', source: Api.TimestampSource.ANIME_SKIP },
      ];
      const expectedToUpdate: Api.Timestamp[] = [
        { id: '0', at: 1, typeId: 'filler', source: Api.TimestampSource.ANIME_SKIP },
        { id: '2', at: 3, typeId: 'intro', source: Api.TimestampSource.BETTER_VRV },
      ];
      const expectedToDelete: Api.Timestamp[] = [
        { id: '4', at: 8, typeId: 'credits', source: Api.TimestampSource.ANIME_SKIP },
        { id: '5', at: 8, typeId: 'filler', source: Api.TimestampSource.ANIME_SKIP },
      ];

      const { toCreate, toUpdate, toDelete } = GeneralUtils.computeTimestampDiffs(
        oldTimestamps,
        newTimestamps
      );

      expect(toCreate).toEqual(expectedToCreate);
      expect(toUpdate).toEqual(expectedToUpdate);
      expect(toDelete).toEqual(expectedToDelete);
    });
  });
});
