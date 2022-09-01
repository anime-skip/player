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
  const storedPreferences = usePlayerStorage<AllPreferences>(
    PREFERENCES_STORAGE_KEY,
    DEFAULT_PREFERENCES
  );
  // If preferences are updated, the stored value might not have all the fields. This adds the
  // missing fields
  const preferences = computed<AllPreferences>(() => ({
    ...DEFAULT_PREFERENCES,
    ...storedPreferences.value,
  }));

  async function setAllPrefs(newPrefs: AllPreferences) {
    await storage.setItem(PREFERENCES_STORAGE_KEY, newPrefs);
    // Set ref because storage listeners aren't fired to the tab the change originated from.
    // We do update the storage when setting this value, but we skip updating it since it's the same
    // value.
    storedPreferences.value = newPrefs;
  }
  function setPref<T>(key: PickTypes<AllPreferences, T>, newValue: T) {
    return setAllPrefs({ ...storedPreferences.value, [key]: newValue });
  }
  function setPartialPrefs(newPrefs: Partial<AllPreferences>) {
    return setAllPrefs({ ...storedPreferences.value, ...newPrefs });
  }
  function resetToDefault() {
    return setAllPrefs(DEFAULT_PREFERENCES);
  }

  return {
    preferences,
    setPref,
    setAllPrefs,
    setPartialPrefs,
    resetToDefault,
  };
});
