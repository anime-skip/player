import Utils from '../Utils';

describe('Utils', () => {
  describe('arrayIncludes()', () => {
    const array = [
      { id: '1', name: 'item 1' },
      { id: '2', name: 'item 2' },
      { id: '3', name: 'item 3' },
      { id: '4' },
    ];

    it('should return true when there is a matching value at the key', () => {
      expect(Utils.arrayIncludes(array, 'id', { id: '1' })).toBeTruthy();
    });

    it('should return false when there is NOT a matching value at the key', () => {
      expect(Utils.arrayIncludes(array, 'name', { id: '4', name: 'item 4' })).toBeFalsy();
    });
  });

  describe('computeTimestampDiffs', () => {
    it('should return the correct toCreate', () => {
      const oldTimestamps: Api.Timestamp[] = [];
      const newTimestamps: Api.AmbigousTimestamp[] = [{ id: '0', at: 0, typeId: 'intro' }];

      const expectedToCreate: Api.AmbigousTimestamp[] = newTimestamps;
      const expectedToUpdate: Api.Timestamp[] = [];
      const expectedToDelete: Api.Timestamp[] = [];

      const { toCreate, toUpdate, toDelete } = Utils.computeTimestampDiffs(
        oldTimestamps,
        newTimestamps
      );

      expect(toCreate).toEqual(expectedToCreate);
      expect(toUpdate).toEqual(expectedToUpdate);
      expect(toDelete).toEqual(expectedToDelete);
    });

    it('should return the correct toUpdate containing only updated timestamps', () => {
      const oldTimestamps: Api.Timestamp[] = [
        { id: '0', at: 0, typeId: 'intro' },
        { id: '1', at: 1, typeId: 'intro' },
        { id: '2', at: 2, typeId: 'intro' },
      ];
      const newTimestamps: Api.AmbigousTimestamp[] = [
        { id: '0', at: 0, typeId: 'branding' },
        { id: '1', at: 1, typeId: 'intro' },
        { id: '2', at: 3, typeId: 'intro' },
      ];

      const expectedToCreate: Api.AmbigousTimestamp[] = [];
      const expectedToUpdate: Api.Timestamp[] = [
        { id: '0', at: 0, typeId: 'branding' },
        { id: '2', at: 3, typeId: 'intro' },
      ];
      const expectedToDelete: Api.Timestamp[] = [];

      const { toCreate, toUpdate, toDelete } = Utils.computeTimestampDiffs(
        oldTimestamps,
        newTimestamps
      );

      expect(toCreate).toEqual(expectedToCreate);
      expect(toUpdate).toEqual(expectedToUpdate);
      expect(toDelete).toEqual(expectedToDelete);
    });

    it('should return the correct toDelete', () => {
      const oldTimestamps: Api.Timestamp[] = [{ id: '0', at: 0, typeId: 'branding' }];
      const newTimestamps: Api.AmbigousTimestamp[] = [];

      const expectedToCreate: Api.AmbigousTimestamp[] = [];
      const expectedToUpdate: Api.Timestamp[] = [];
      const expectedToDelete: Api.Timestamp[] = oldTimestamps;

      const { toCreate, toUpdate, toDelete } = Utils.computeTimestampDiffs(
        oldTimestamps,
        newTimestamps
      );

      expect(toCreate).toEqual(expectedToCreate);
      expect(toUpdate).toEqual(expectedToUpdate);
      expect(toDelete).toEqual(expectedToDelete);
    });

    it('should return the correct toCreate, toUpdate (only updated items), toDelete for a complete example', () => {
      const oldTimestamps: Api.Timestamp[] = [
        { id: '0', at: 0, typeId: 'branding' },
        { id: '1', at: 2, typeId: 'recap' },
        { id: '2', at: 4, typeId: 'intro' },
        { id: '3', at: 6, typeId: 'cannon' },
        { id: '4', at: 8, typeId: 'credits' },
        { id: '5', at: 8, typeId: 'filler' },
      ];
      const newTimestamps: Api.AmbigousTimestamp[] = [
        { id: '0', at: 1, typeId: 'filler' },
        { id: '1', at: 2, typeId: 'recap' },
        { id: '2', at: 3, typeId: 'intro' },
        { id: '6', at: 4, typeId: 'filler' },
        { id: '3', at: 6, typeId: 'cannon' },
        { id: '7', at: 7, typeId: 'credits' },
        { id: '8', at: 8, typeId: 'preview' },
      ];

      const expectedToCreate: Api.AmbigousTimestamp[] = [
        { id: '6', at: 4, typeId: 'filler' },
        { id: '7', at: 7, typeId: 'credits' },
        { id: '8', at: 8, typeId: 'preview' },
      ];
      const expectedToUpdate: Api.Timestamp[] = [
        { id: '0', at: 1, typeId: 'filler' },
        { id: '2', at: 3, typeId: 'intro' },
      ];
      const expectedToDelete: Api.Timestamp[] = [
        { id: '4', at: 8, typeId: 'credits' },
        { id: '5', at: 8, typeId: 'filler' },
      ];

      const { toCreate, toUpdate, toDelete } = Utils.computeTimestampDiffs(
        oldTimestamps,
        newTimestamps
      );

      expect(toCreate).toEqual(expectedToCreate);
      expect(toUpdate).toEqual(expectedToUpdate);
      expect(toDelete).toEqual(expectedToDelete);
    });
  });
});
