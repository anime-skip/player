import { GqlPreferences } from '@anime-skip/axios-api';
import * as Api from '../api';
import { useApiClient } from '../hooks/useApiClient';
import { useWebExtensionStorage } from '../hooks/useWebExtensionStorage';

type RemotePreferences = Omit<
  GqlPreferences,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'userId' | 'user'
>;

interface LocalPreferences {
  playbackRate: number;
}

// const LOCAL_PREFERENCES: Array<keyof LocalPreferences> = ['playbackRate'];

type GeneralPreferences = RemotePreferences & LocalPreferences;

type StripOtherTypes<TObject, TKeepTypes> = {
  [Key in keyof TObject]: TObject[Key] extends TKeepTypes ? Key : never;
}[keyof TObject];

const DEFAULT_GENERAL_PREFERENCES: GeneralPreferences = {
  enableAutoPlay: true,
  enableAutoSkip: false,
  hideTimelineWhenMinimized: false,
  minimizeToolbarWhenEditing: false,
  playbackRate: 1,
  skipBranding: false,
  skipCanon: false,
  skipCredits: false,
  skipFiller: false,
  skipIntros: false,
  skipMixedCredits: false,
  skipMixedIntros: false,
  skipNewCredits: false,
  skipNewIntros: false,
  skipPreview: false,
  skipRecaps: false,
  skipTitleCard: false,
  skipTransitions: false,
};

export function useUpdateGeneralPreferences() {
  return _useGeneralPreferences().updatePreferences;
}

function _useGeneralPreferences() {
  const { value: preferences, updateValue: updatePreferences } =
    useWebExtensionStorage<GeneralPreferences>(
      'general-preferences',
      DEFAULT_GENERAL_PREFERENCES,
      'local'
    );

  return {
    preferences,
    updatePreferences,
  };
}

/**
 * Current preferences with the defaults applied first so new local preferences aren't left out
 */
export function useGeneralPreferences() {
  const { preferences } = _useGeneralPreferences();
  return computed<GeneralPreferences>(() => ({
    ...DEFAULT_GENERAL_PREFERENCES,
    ...preferences,
  }));
}

export function useUpdateBooleanPref() {
  const { preferences, updatePreferences } = _useGeneralPreferences();
  const api = useApiClient();
  return (pref: StripOtherTypes<GeneralPreferences, boolean>, newValue: boolean) => {
    const oldValue = preferences.value[pref];
    updatePreferences({ [pref]: newValue });

    api.savePreferences(Api.PREFERENCES_QUERY, { preferences: { [pref]: newValue } }).catch(err => {
      console.warn('Failed to update preference', { pref, newValue }, err);
      // Slight delay for a better animation
      setTimeout(() => updatePreferences({ [pref]: oldValue }), 200);
    });
  };
}

export function useToggleBooleanPref() {
  const update = useUpdateBooleanPref();
  const preferences = useGeneralPreferences();
  return (pref: StripOtherTypes<GeneralPreferences, boolean>) => {
    update(pref, !preferences.value[pref]);
  };
}

export function useUpdateNumberPref() {
  const { updatePreferences } = _useGeneralPreferences();
  return (pref: StripOtherTypes<GeneralPreferences, number>, newValue: number) => {
    updatePreferences({ [pref]: newValue });
  };
}

export function useResetPreferences() {
  const { updatePreferences } = _useGeneralPreferences();
  return () => {
    updatePreferences(DEFAULT_GENERAL_PREFERENCES);
  };
}
