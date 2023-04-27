import { TimestampFragment, TimestampType } from './api';
import { AllPreferences } from './preferences';

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

// prettier-ignore
export function isTimestampSkipped(
  timestampTypeId: TimestampType['id'],
  preferences: AllPreferences | undefined | null,
  isSkipping: boolean,
): boolean {
  if (!isSkipping) return false; 

  if (timestampTypeId === '97e3629a-95e5-4b1a-9411-73a47c0d0e25') return !!preferences?.skipBranding;
  if (timestampTypeId === '9edc0037-fa4e-47a7-a29a-d9c43368daa8') return !!preferences?.skipCanon;
  if (timestampTypeId === '2a730a51-a601-439b-bc1f-7b94a640ffb9') return !!preferences?.skipCredits;
  if (timestampTypeId === 'c48f1dce-1890-4394-8ce6-c3f5b2f95e5e') return !!preferences?.skipFiller;
  if (timestampTypeId === '14550023-2589-46f0-bfb4-152976506b4c') return !!preferences?.skipIntros;
  if (timestampTypeId === '6c4ade53-4fee-447f-89e4-3bb29184e87a') return !!preferences?.skipMixedCredits;
  if (timestampTypeId === 'cbb42238-d285-4c88-9e91-feab4bb8ae0a') return !!preferences?.skipMixedIntros;
  if (timestampTypeId === 'd839cdb1-21b3-455d-9c21-7ffeb37adbec') return !!preferences?.skipNewCredits;
  if (timestampTypeId === '679fb610-ff3c-4cf4-83c0-75bcc7fe8778') return !!preferences?.skipNewIntros;
  if (timestampTypeId === 'c7b1eddb-defa-4bc6-a598-f143081cfe4b') return !!preferences?.skipPreview;
  if (timestampTypeId === 'f38ac196-0d49-40a9-8fcf-f3ef2f40f127') return !!preferences?.skipRecaps;
  if (timestampTypeId === '9f0c6532-ccae-4238-83ec-a2804fe5f7b0') return !!preferences?.skipTransitions;
  if (timestampTypeId === '67321535-a4ea-4f21-8bed-fb3c8286b510') return !!preferences?.skipTitleCard;
  return false;
}

/**
 * Return the timestamp that the provided time is in seconds. Assumes that the timestamps are sorted.
 */
export function getTimestampAtTime(
  timestamps: ReadonlyArray<TimestampFragment> | undefined,
  timeInS: number,
) {
  return timestamps?.filter((t) => timeInS + 0.001 >= t.at).pop();
}
