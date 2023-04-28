import { AllPreferences } from '../utils/preferences';
import usePreferences from './usePreferences';
import useSavePreferencesMutation from './useSavePreferencesMutation';

/**
 * Utility for getting an interactive ref of a specific preference. If the preference is local, it
 * will just update storage. If the preference is from the API, it will update both the API and
 * local storage.
 *
 * ```vue
 * <script lang="ts" setup>
 * const { pref: playbackRate, isSaving } = usePreference("playbackRate", true)
 * </script>
 *
 * <template>
 *   <input type="number" v-model="playbackRate" :disabled="isSaving" />
 * </template>
 * ```
 */
export default function <T extends keyof AllPreferences>(
  key: T,
  isLocal: boolean | undefined,
) {
  const { state: storedPrefs } = usePreferences();
  const { state: auth } = useAuth();

  const { mutateAsync: savePrefs } = useSavePreferencesMutation();

  const updatePref = useMutation(async (newValue: AllPreferences[T]) => {
    // Don't continue if the prefs aren't loaded yet.
    const currentPrefs = toRaw(storedPrefs.value!);
    const oldValue = currentPrefs[key];

    try {
      // Update local value
      storedPrefs.value = {
        ...currentPrefs,
        [key]: newValue,
      };
      // Update API
      await savePrefs({ preferences: { [key]: newValue } });
    } catch (err) {
      console.error('Failed to save preferences:', err);
      window.alert('Failed to save preferences: ' + String(err));
      storedPrefs.value = {
        ...storedPrefs.value!, // Stored value may have changed, use latest value (should always exist, should be loaded at this point.)
        [key]: oldValue,
      };
    }
  });

  return {
    isSaving: updatePref.isLoading,
    error: updatePref.error,
    isError: updatePref.isError,
    pref: computed({
      get() {
        return storedPrefs.value?.[key];
      },
      set(newValue) {
        // Don't continue if the prefs aren't loaded yet.
        if (storedPrefs.value == null) return;

        if (!isLocal && auth.value) {
          updatePref.mutate(newValue!);
        } else {
          storedPrefs.value = {
            ...storedPrefs.value,
            [key]: newValue,
          };
        }
      },
    }),
  };
}
