import { GqlPreferences } from '@anime-skip/api-client';
import * as Api from '~api';
import { ColorTheme } from '~api';
import { useApiClient } from '../hooks/useApiClient';
import { createWebExtProvideInject } from '../utils/createWebExtProvideInject';
import { warn } from '../utils/log';

type RemotePreferences = Omit<
  GqlPreferences,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'userId' | 'user'
>;

interface LocalPreferences {
  playbackRate: number;
  createTimestampSnapBack: boolean;
}

// const LOCAL_PREFERENCES: Array<keyof LocalPreferences> = ['playbackRate'];

type GeneralPreferences = RemotePreferences & LocalPreferences;

export {
  provideGeneralPreferences,
  useUpdateGeneralPreferences,
  useInitGeneralPreferencesListener,
};

const DEFAULT_GENERAL_PREFERENCES: GeneralPreferences = {
  enableAutoPlay: true,
  enableAutoSkip: false,
  hideTimelineWhenMinimized: false,
  minimizeToolbarWhenEditing: false,
  colorTheme: ColorTheme.ANIME_SKIP_BLUE,
  playbackRate: 1,
  createTimestampSnapBack: true,
  skipBranding: true,
  skipCanon: false,
  skipCredits: true,
  skipFiller: false,
  skipIntros: true,
  skipMixedCredits: true,
  skipMixedIntros: true,
  skipNewCredits: true,
  skipNewIntros: true,
  skipPreview: true,
  skipRecaps: true,
  skipTitleCard: true,
  skipTransitions: true,
};

const {
  provideValue: provideGeneralPreferences,
  useUpdate: useUpdateGeneralPreferences,
  useValue: _useGeneralPreferences,
  useInitStorageListener: useInitGeneralPreferencesListener,
} = createWebExtProvideInject<GeneralPreferences>(
  'general-preferences',
  'local',
  DEFAULT_GENERAL_PREFERENCES
);

/**
 * Current preferences with the defaults applied first so new local preferences aren't left out
 */
export function useGeneralPreferences() {
  const preferences = _useGeneralPreferences();
  return computed<GeneralPreferences>(() => ({
    ...DEFAULT_GENERAL_PREFERENCES,
    ...preferences,
  }));
}

export function useUpdateBooleanPref() {
  const preferences = useGeneralPreferences();
  const updatePreferences = useUpdateGeneralPreferences();
  const api = useApiClient();

  return (
    pref: StripOtherTypes<GeneralPreferences, boolean>,
    newValue: boolean,
    isLocal = false
  ) => {
    const oldValue = preferences.value[pref];
    updatePreferences({ [pref]: newValue });

    if (!isLocal)
      api
        .savePreferences(Api.PREFERENCES_QUERY, { preferences: { [pref]: newValue } })
        .catch(err => {
          warn('Failed to update preference', { pref, newValue }, err);
          // Slight delay for a better animation
          setTimeout(() => updatePreferences({ [pref]: oldValue }), 200);
        });
  };
}

export function useToggleBooleanPref() {
  const updateRemote = useUpdateRemotePref<boolean>();
  const updateLocal = useUpdateLocalPref<boolean>();

  const preferences = useGeneralPreferences();

  return (pref: StripOtherTypes<GeneralPreferences, boolean>, isLocal = false) => {
    const newValue = !preferences.value[pref];
    if (isLocal) updateLocal(pref, newValue);
    else updateRemote(pref, newValue);
  };
}

export function useUpdateLocalPref<T>() {
  const updatePreferences = useUpdateGeneralPreferences();
  return (pref: StripOtherTypes<GeneralPreferences, T>, newValue: T) => {
    updatePreferences({ [pref]: newValue });
  };
}

export function useUpdateRemotePref<T>() {
  const preferences = useGeneralPreferences();
  const updatePreferences = useUpdateGeneralPreferences();
  const api = useApiClient();

  return (pref: StripOtherTypes<GeneralPreferences, T>, newValue: T) => {
    const oldValue = preferences.value[pref];
    updatePreferences({ [pref]: newValue });

    api.savePreferences(Api.PREFERENCES_QUERY, { preferences: { [pref]: newValue } }).catch(err => {
      warn('Failed to update preference', { pref, newValue }, err);
      // Slight delay for a better animation
      setTimeout(() => updatePreferences({ [pref]: oldValue }), 200);
    });
  };
}

export function useResetPreferences() {
  const updatePreferences = useUpdateGeneralPreferences();
  return () => {
    updatePreferences(DEFAULT_GENERAL_PREFERENCES);
  };
}
