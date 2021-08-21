import { GqlPreferences } from '@anime-skip/axios-api';
import * as Api from '../hooks/api';
import { useApiClient } from '../hooks/useApiClient';
import { useWebExtensionStorage } from '../hooks/useWebExtensionStorage';

type RemotePreferences = Omit<
  GqlPreferences,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'userId' | 'user'
>;

interface LocalPreferences {
  playbackRate: number;
}

const LOCAL_PREFERENCES: Array<keyof LocalPreferences> = ['playbackRate'];

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

export function useGeneralPreferences() {
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

export function useUpdateBooleanPref() {
  const { preferences, updatePreferences } = useGeneralPreferences();
  const api = useApiClient();
  return (pref: StripOtherTypes<GeneralPreferences, boolean>, newValue: boolean) => {
    const oldValue = preferences.value[pref];
    updatePreferences({ [pref]: newValue });

    api.savePreferences(Api.PREFERENCES_QUERY, { preferences: { [pref]: newValue } }).catch(err => {
      console.warn('Failed to update preference', { pref, newValue }, err);
      updatePreferences({ [pref]: oldValue });
    });
  };
}

export function useToggleBooleanPref() {
  const update = useUpdateBooleanPref();
  const { preferences } = useGeneralPreferences();
  return (pref: StripOtherTypes<GeneralPreferences, boolean>) => {
    update(pref, !preferences.value[pref]);
  };
}

export function useUpdateNumberPref() {
  const { updatePreferences } = useGeneralPreferences();
  return (pref: StripOtherTypes<GeneralPreferences, number>, newValue: number) => {
    updatePreferences({ [pref]: newValue });
  };
}

export function useResetPreferences() {
  const { updatePreferences } = useGeneralPreferences();
  return () => {
    updatePreferences(DEFAULT_GENERAL_PREFERENCES);
  };
}
