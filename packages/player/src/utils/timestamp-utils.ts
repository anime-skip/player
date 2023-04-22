import { TimestampFragment } from './api/graphql.generated';

export interface Section extends TimestampFragment {
  endAt: number;
}

export function buildSections(
  timestamps: ReadonlyArray<TimestampFragment>,
  duration: number,
): Section[] {
  const sections: Section[] = [];

  for (let i = 0; i < timestamps.length; i++) {
    const timestamp = timestamps[i];
    sections.push({
      ...timestamps[i],
      endAt: Math.max(duration, timestamps[i].at),
    });
    if (i > 0) sections[i - 1].endAt = timestamp.at;
  }

  return sections;
}

export function getNextTimestamp(
  timestamps: Readonly<TimestampFragment[]>,
  timeInS: number,
): TimestampFragment | undefined {
  return timestamps.find((t) => timeInS < t.at);
}

export function getPreviousTimestamp(
  timestamps: Readonly<TimestampFragment[]>,
  timeInS: number,
): TimestampFragment | undefined {
  return timestamps.filter((t) => timeInS > t.at).pop();
}
