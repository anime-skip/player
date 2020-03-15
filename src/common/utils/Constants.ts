export const persistedKeys = [
  'token' as const,
  'tokenExpiresAt' as const,
  'refreshToken' as const,
  'refreshTokenExpiresAt' as const,
  'loginRequestState' as const,
  'account' as const,
];

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
