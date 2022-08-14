import { KeyboardShortcutActionToKeyBindingMap } from '~/stores/useKeyboardShortcutPrefs';
import type * as Api from '~api';
import { TimestampSource } from '~api';
import { PickTypes, PlaybackRate } from '~types';
import { DAY, HOUR } from '~utils/time';

export const persistedKeys = [
  'token' as const,
  'tokenExpiresAt' as const,
  'refreshToken' as const,
  'refreshTokenExpiresAt' as const,
  'isLoggedIn' as const,
  'account' as const,
  'playbackRate' as const,
  'primaryKeyboardShortcuts' as const,
  'secondaryKeyboardShortcuts' as const,
];

export const FRAME = 1 / 12;
export const ACCESS_TOKEN_DURATION = 12 * HOUR;
export const REFRESH_TOKEN_DURATION = 7 * DAY;
export const UNAUTHORIZED_ERROR_MESSAGE = 'unauthorized - log out';

export const ACCEPTED_KEYS: { [keyCode: number]: string } = {
  13: 'ENTER',
  27: 'ESC',
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

export const DEFAULT_PRIMARY_KEYBOARD_SHORTCUTS: KeyboardShortcutActionToKeyBindingMap = {
  playPause: 'D',
  toggleFullscreen: 'G',
  volumeUp: '↑',
  volumeDown: '↓',
  hideDialog: '`',
  nextTimestamp: 'shift+L',
  previousTimestamp: 'shift+J',
  advanceFrame: 'L',
  advanceSmall: 'V',
  advanceMedium: 'F',
  advanceLarge: 'R',
  rewindFrame: 'J',
  rewindSmall: 'X',
  rewindMedium: 'S',
  rewindLarge: 'W',
  createTimestamp: 'K',
  saveTimestamps: 'ctrl+ENTER',
  discardChanges: 'ctrl+`',
};

export const DEFAULT_SECONDARY_KEYBOARD_SHORTCUTS: KeyboardShortcutActionToKeyBindingMap = {
  playPause: 'Space',
  advanceMedium: '→',
  rewindMedium: '←',
  nextTimestamp: 'shift+→',
  previousTimestamp: 'shift+←',
};

export const TIMESTAMP_TYPES: Api.TimestampType[] = [
  {
    name: 'Canon',
    id: '9edc0037-fa4e-47a7-a29a-d9c43368daa8',
    description: 'New plot that has not been revealed',
  },
  // {
  //   name: 'Must Watch',
  //   id: 'e384759b-3cd2-4824-9569-128363b4452b',
  //   description:
  //     'A non-canon section of the episode that should not be skipped. (I.E. The Chika Dance https://youtu.be/6xKAsZZgskg)',
  // },
  {
    name: 'Branding',
    id: '97e3629a-95e5-4b1a-9411-73a47c0d0e25',
    description: 'The small animation letting you know who made the show',
  },
  {
    name: 'Intro',
    id: '14550023-2589-46f0-bfb4-152976506b4c',
    description: 'The intro of each episode, generally around 1:30 long',
  },
  {
    name: 'Mixed Intro',
    id: 'cbb42238-d285-4c88-9e91-feab4bb8ae0a',
    description:
      'The intro at the beginning of an episode that is overlaid with plot. Sometimes the last episode of a show does this',
  },
  {
    name: 'New Intro',
    id: '679fb610-ff3c-4cf4-83c0-75bcc7fe8778',
    description: "The first of an intro, sometimes it's nice to watch each of the intros",
  },
  {
    name: 'Recap',
    id: 'f38ac196-0d49-40a9-8fcf-f3ef2f40f127',
    description: 'A recap of the previous episode',
  },
  {
    name: 'Filler',
    id: 'c48f1dce-1890-4394-8ce6-c3f5b2f95e5e',
    description: 'Content that has no bearing on the actual story',
  },
  {
    name: 'Transition',
    id: '9f0c6532-ccae-4238-83ec-a2804fe5f7b0',
    description: 'The small animation show to transition into and out of commercials',
  },
  {
    name: 'Credits',
    id: '2a730a51-a601-439b-bc1f-7b94a640ffb9',
    description: 'The credits/outro at the end of each episode',
  },
  {
    name: 'Mixed Credits',
    id: '6c4ade53-4fee-447f-89e4-3bb29184e87a',
    description:
      'The credits/outro at the end of an episode that is overlaid with plot. Sometimes the last episode of a show does this',
  },
  {
    name: 'New Credits',
    id: 'd839cdb1-21b3-455d-9c21-7ffeb37adbec',
    description: "The first of an outro, sometimes it's nice to watch each of the outros",
  },
  {
    name: 'Preview',
    id: 'c7b1eddb-defa-4bc6-a598-f143081cfe4b',
    description: 'The preview for the next episode',
  },
  {
    name: 'Title Card',
    id: '67321535-a4ea-4f21-8bed-fb3c8286b510',
    description:
      'A short section of the episode that just displays the name of the episode, where no plot development takes place',
  },
];

export const TIMESTAMP_TYPE_NOT_SELECTED = '';

/**
 * `string` return type is the string that should be displayed
 * `null` return type means nothing should be displayed
 * `undefined` return type means the source was unknown, and "Unknown Source" should be displayed
 */
export const TIMESTAMP_SOURCES: { [source in TimestampSource]: string | undefined | null } = {
  ANIME_SKIP: null,
  BETTER_VRV: 'BetterVRV',
};

interface SkippablePreference {
  key: PickTypes<Api.Preferences, boolean>;
  title: string;
  help: string;
}

/**
 * The content to show in the skipped preferences section
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
    help: 'Any plot recap, filler or cannon, that happened in the previous. Recaps are not flashbacks, unless flashbacks are also shown in the recap',
  },
  {
    key: 'skipTitleCard',
    title: 'Title Cards',
    help: 'A dedicated still shot that shows the title of the episode. Any titles that are overlaid and blended into opening shots are not considered a title card',
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
    help: 'Introduction sequences that has the regular intro music playing in the background but instead of the standard intro animation, a different, plot oriented, animation is played',
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
    help: 'Short animation that plays before and after a commercial break. Most of the time, this is an info card about the world or characters',
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
    help: 'Closing sequences that has the regular credits music playing in the background but instead of the standard credit animation, a different, plot oriented, animation is played',
  },
  {
    key: 'skipPreview',
    title: 'Previews',
    help: 'A short preview of what is to come in the next episode',
  },
];

export const PLAYER_ACTIVITY_TIMEOUT = 3000;

/**
 * When going back to the previous timestamp, take `(currentTime - LOOKUP_PREV_TIMESTAMP_OFFSET)` so
 * the user can more easily go back a timestamp instead of taking them right back to the timestamp
 * they were at, or forcing them to spam
 */
export const LOOKUP_PREV_TIMESTAMP_OFFSET = 1.5;
