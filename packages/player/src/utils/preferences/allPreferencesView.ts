import { ColorTheme } from '../api';
import { defaultPreferences } from './defaultPreferences';
import { AllPreferences } from './types';
import { PreferencesCheckboxView, PreferencesView } from './views';

// TODO: Remove once layout is shipped from the API
export const prefTitles: Record<keyof AllPreferences, string> = {
  colorTheme: 'Theme',
  createTimestampSnapBack: 'Snap new timestamps',
  enableAutoPlay: 'Auto-play video',
  enableAutoSkip: 'Auto-skip sections',
  hideTimelineWhenMinimized: 'Hide timeline when minimized',
  minimizeToolbarWhenEditing: 'Minimize toolbar when editing',
  playbackRate: 'Playback Rate',
  skipBranding: 'Branding',
  skipCanon: 'Canon',
  skipCredits: 'Credits',
  skipFiller: 'Filler',
  skipIntros: 'Intros',
  skipMixedCredits: 'Mixed Credits',
  skipMixedIntros: 'Mixed Intros',
  skipNewCredits: 'New Credits',
  skipNewIntros: 'New Intros',
  skipPreview: 'Preview',
  skipRecaps: 'Recaps',
  skipTitleCard: 'Title Card',
  skipTransitions: 'Transitions',
  __typename: '',
};

export const allPreferencesView: PreferencesView[] = [
  { type: 'header', text: 'General' },
  {
    type: 'grid',
    columns: 2,
    children: [
      { type: 'playback-rate', preferenceKey: 'playbackRate', isLocal: true },
      {
        type: 'select',
        preferenceKey: 'colorTheme',
        label: prefTitles.colorTheme,
        options: [
          { display: 'Anime Skip Blue', value: ColorTheme.AnimeSkipBlue },
          { display: 'Dynamic', value: ColorTheme.PerService },
          {
            display: 'Crunchyroll Orange',
            value: ColorTheme.CrunchyrollOrange,
          },
          { display: 'Funimation Purple', value: ColorTheme.FunimationPurple },
          { display: 'VRV Yellow', value: ColorTheme.VrvYellow },
        ],
      },
      {
        type: 'checkbox',
        preferenceKey: 'enableAutoSkip',
        text: prefTitles.enableAutoSkip,
      },
      {
        type: 'checkbox',
        preferenceKey: 'createTimestampSnapBack',
        text: prefTitles.createTimestampSnapBack,
        description: 'Snap to previous 0.5s when creating a timestamp',
        isLocal: true,
      },
      {
        type: 'checkbox',
        preferenceKey: 'hideTimelineWhenMinimized',
        text: prefTitles.hideTimelineWhenMinimized,
      },
      {
        type: 'checkbox',
        preferenceKey: 'minimizeToolbarWhenEditing',
        text: prefTitles.minimizeToolbarWhenEditing,
      },
    ],
  },

  { type: 'header', text: 'What do you want to watch?' },
  {
    type: 'grid',
    columns: 3,
    children: Object.keys(defaultPreferences)
      .filter((key) => key.startsWith('skip'))
      .map(
        (key): PreferencesCheckboxView => ({
          type: 'checkbox',
          invert: true,
          preferenceKey: key as keyof AllPreferences,
          text: prefTitles[key as keyof AllPreferences],
        }),
      ),
  },

  { type: 'header', text: 'Keyboard Shortcuts' },
  {
    type: 'keyboard-shortcuts',
  },
];
