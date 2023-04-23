import { UserFragment, TimestampFragment, TimestampSource } from '../api';
import chance from 'chance';
import { MINUTE, SECOND } from '../time';

export const rand = chance(__TEST_SEED__);

export function fakeTimestampFragment(
  overrides?: Partial<TimestampFragment>,
): TimestampFragment {
  const defaults: TimestampFragment = {
    at: rand.floating({ min: 0, max: (24 * MINUTE) / SECOND }),
    typeId: fakeApiId(),
    createdAt: fakeApiDate(),
    createdBy: fakeUserFragment(),
    episodeId: fakeApiId(),
    id: fakeApiId(),
    source: rand.pickone([
      TimestampSource.AnimeSkip,
      TimestampSource.BetterVrv,
    ]),
    updatedAt: fakeApiDate(),
    updatedBy: fakeUserFragment(),
  };
  return { ...defaults, ...overrides };
}

export function fakeUserFragment(
  overrides?: Partial<UserFragment>,
): UserFragment {
  const defaults: UserFragment = {
    createdAt: fakeApiDate(),
    id: fakeApiId(),
    profileUrl: rand.url({
      domain: 'anime-skip.com',
      extensions: ['svg', 'png', 'jpg'],
    }),
    username: rand.name({ full: false }).toLowerCase(),
  };
  return { ...defaults, ...overrides };
}

export function fakeApiDate(date?: number | Date): string {
  const d = date ? new Date(date) : rand.date();
  return d.toISOString();
}

export function fakeApiId(): string {
  return rand.guid();
}

export function fakeVideoDuration(): number {
  return rand.natural({
    min: (20 * MINUTE) / SECOND,
    max: (24 * MINUTE) / SECOND,
  });
}
