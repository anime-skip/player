import { PickTypes } from 'common/src/types';
import { storeToRefs } from 'pinia';
import { AllPreferences, usePreferencesStore } from '../stores/usePreferencesStore';
import { useSavePreferencesMutation } from './useSavePreferencesMutation';

export function useToggleBooleanPreferenceMutation() {
  const { preferences } = storeToRefs(usePreferencesStore());
  const query = useSavePreferencesMutation();
  return {
    ...query,
    mutate(pref: PickTypes<AllPreferences, boolean>) {
      return query.mutate({ [pref]: !preferences.value[pref] });
    },
    mutateAsync(pref: PickTypes<AllPreferences, boolean>) {
      return query.mutateAsync({ [pref]: !preferences.value[pref] });
    },
  };
}
