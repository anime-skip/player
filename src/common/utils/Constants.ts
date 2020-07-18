import { as } from './GlobalUtils';

export const persistedKeys = [
  'token' as const,
  'tokenExpiresAt' as const,
  'refreshToken' as const,
  'refreshTokenExpiresAt' as const,
  'loginRequestState' as const,
  'account' as const,
  'playbackRate' as const,
];

export const ACCEPTED_KEYS: { [keyCode: number]: string } = {
  13: 'ENTER',
  32: 'SPACE',
  37: 'LEFT',
  38: 'UP',
  39: 'RIGHT',
  40: 'DOWN',
  65: 'A',
  67: 'C',
  68: 'D',
  69: 'E',
  70: 'F',
  73: 'I',
  74: 'J',
  75: 'K',
  76: 'L',
  77: 'M',
  79: 'O',
  81: 'Q',
  82: 'R',
  83: 'S',
  86: 'V',
  87: 'W',
  88: 'X',
  90: 'Z',
  188: ',',
  219: '[',
  221: ']',
};

export const PLAYBACK_SPEEDS: PlaybackRate[] = [
  {
    value: 0.5,
    display: '0.5',
  },
  {
    value: 1,
    display: '1.0',
  },
  {
    value: 1.25,
    display: '1.25',
    hideWhenSmall: true,
  },
  {
    value: 1.5,
    display: '1.5',
  },
  {
    value: 2,
    display: '2.0',
  },
];

export const TIMESTAMP_TYPES = {
  mustWatch: as<Api.TimestmampType>({
    id: '9edc0037-fa4e-47a7-a29a-d9c43368daa8',
    name: '',
    description: '',
  }),
};

/**
 * The content to show in the skipped prefereces section
 */
export const SKIPPABLE_PREFERENCES: SkippablePreference[] = [
  {
    key: 'skipBranding',
    title: 'Branding',
    help: 'Publisher and studio branding animations, generally right at the start of the episode',
  },
  {
    key: 'skipRecaps',
    title: 'Recaps',
    help:
      'Any plot recap, filler or cannon, that happened in the previous. Recaps are not flashbacks, unless flashbacks are also shown in the recap',
  },
  {
    key: 'skipTitleCard',
    title: 'Title Cards',
    help:
      'A dedicated still shot that shows the title of the episode. Any titles that are overlaid and blended into opening shots are not considered a title card',
  },
  {
    key: 'skipIntros',
    title: 'Intros',
    help: 'Introduction sequences, generally around a minute and a half',
  },
  {
    key: 'skipNewIntros',
    title: 'New Intros',
    help: 'Introduction sequences that are shown for the first time',
  },
  {
    key: 'skipMixedIntros',
    title: 'Mixed Intros',
    help:
      'Introduction sequences that has the regular intro music playing in the background but instead of the standard intro animation, a different, plot oriented, animation is played',
  },
  {
    key: 'skipCanon',
    title: 'Cannon',
    help: "A story driven section that is faithful to the source material's plot",
  },
  {
    key: 'skipFiller',
    title: 'Filler',
    help: "A story driven section that does not follow the source material's plot",
  },
  {
    key: 'skipTransitions',
    title: 'Transitions',
    help:
      'Short animation that plays before and after a commertial break. Most of the time, this is an info card about the world or characters',
  },
  {
    key: 'skipCredits',
    title: 'Credits',
    help: 'Closing sequences, generally around a minute and a half',
  },
  {
    key: 'skipNewCredits',
    title: 'New Credits',
    help: 'Closing sequences that are shown for the first time',
  },
  {
    key: 'skipMixedCredits',
    title: 'Mixed Credits',
    help:
      'Closing sequences that has the regular credits music playing in the background but instead of the standard credit animation, a different, plot oriented, animation is played',
  },
  {
    key: 'skipPreview',
    title: 'Previews',
    help: 'A short preview of what is to come in the next episode',
  },
];
