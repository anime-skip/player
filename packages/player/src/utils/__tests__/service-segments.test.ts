import { describe, it, expect } from 'vitest';

import { serviceSegmentsToTimestamps } from '../timestamp-utils';

const CANON = '9edc0037-fa4e-47a7-a29a-d9c43368daa8';
const INTRO = '14550023-2589-46f0-bfb4-152976506b4c';
const CREDITS = '2a730a51-a601-439b-bc1f-7b94a640ffb9';

const summarize = (...args: Parameters<typeof serviceSegmentsToTimestamps>) =>
  serviceSegmentsToTimestamps(...args).map((t) => [t.at, t.typeId]);

describe('serviceSegmentsToTimestamps', () => {
  it('should add canon before, between, and after segments', () => {
    expect(
      summarize(
        [
          { type: 'intro', start: 67, end: 157 },
          { type: 'credits', start: 1315, end: 1405 },
        ],
        1500,
      ),
    ).toEqual([
      [0, CANON],
      [67, INTRO],
      [157, CANON],
      [1315, CREDITS],
      [1405, CANON],
    ]);
  });

  it('should not add canon when the segment runs to the end of the video', () => {
    expect(summarize([{ type: 'credits', start: 100, end: 200 }], 200)).toEqual(
      [
        [0, CANON],
        [100, CREDITS],
      ],
    );
  });

  it('should not add canon at 0 when a segment starts there', () => {
    expect(summarize([{ type: 'intro', start: 0, end: 50 }], 200)).toEqual([
      [0, INTRO],
      [50, CANON],
    ]);
  });

  it('should ignore invalid segments', () => {
    expect(summarize([{ type: 'intro', start: 50, end: 50 }], 200)).toEqual([]);
  });
});
