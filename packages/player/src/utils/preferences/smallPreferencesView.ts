import { PreferencesCheckboxView, PreferencesView } from './views';
import { prefTitles } from './allPreferencesView';
import { defaultPreferences } from './defaultPreferences';
import { AllPreferences } from './types';

export const smallPreferencesView: PreferencesView[] = [
  { type: 'header', text: 'General Settings' },
  {
    type: 'grid',
    columns: 1,
    children: [
      { type: 'playback-rate', preferenceKey: 'playbackRate', isLocal: true },
      {
        type: 'checkbox',
        preferenceKey: 'enableAutoSkip',
        text: 'Enable Autoskip',
      },
      { type: 'service-settings' },
      { type: 'all-settings-link' },
    ],
  },

  { type: 'header', text: 'What do you want to watch?' },
  {
    type: 'grid',
    columns: 2,
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
];
