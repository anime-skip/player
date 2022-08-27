import { GqlInputPreferences } from '@anime-skip/api-client';
import { ColorTheme } from 'common/src/api';
import { PickTypes } from 'common/src/types';
import { defineStore } from 'pinia';
import { usePlayerConfig } from '../../composables/usePlayerConfig';
import { usePlayerStorage } from '../../composables/usePlayerStorage';
import { AuthAccountPreferences } from '../composables/useLoginMutation';

export interface LocalPreferences {
  playbackRate: number;
  createTimestampSnapBack: boolean;
}

export type AllPreferences = AuthAccountPreferences & LocalPreferences;

export const DEFAULT_LOCAL_PREFERENCES: LocalPreferences = {
  createTimestampSnapBack: true,
  playbackRate: 1,
};
export const DEFAULT_REMOTE_PREFERENCES: AuthAccountPreferences = {
  enableAutoPlay: true,
  enableAutoSkip: false,
  hideTimelineWhenMinimized: false,
  minimizeToolbarWhenEditing: false,
  colorTheme: ColorTheme.ANIME_SKIP_BLUE,
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
export const DEFAULT_PREFERENCES: AllPreferences = {
  ...DEFAULT_LOCAL_PREFERENCES,
  ...DEFAULT_REMOTE_PREFERENCES,
};

export const PREFERENCES_STORAGE_KEY = 'general-preferences';

export const usePreferencesStore = defineStore('preferences', () => {
  const { storage } = usePlayerConfig();
  const storedPrefs = usePlayerStorage<AllPreferences>(
    PREFERENCES_STORAGE_KEY,
    DEFAULT_PREFERENCES
  );
  // If preferences are updated, the stored value might not have all the fields. This adds the
  // missing fields
  const allPreferences = computed<AllPreferences>(() => ({
    ...DEFAULT_PREFERENCES,
    ...storedPrefs.value,
  }));

  function setAllPrefs(newPrefs: AllPreferences) {
    return storage.setItem(PREFERENCES_STORAGE_KEY, newPrefs);
  }
  function setPref<T>(key: PickTypes<AllPreferences, T>, newValue: T) {
    return setAllPrefs({ ...storedPrefs.value, [key]: newValue });
  }
  function setPartialPrefs(newPrefs: Partial<AllPreferences>) {
    return setAllPrefs({ ...storedPrefs.value, ...newPrefs });
  }

  return {
    allPreferences,
    setPref,
    setAllPrefs,
    setPartialPrefs,
  };
});
