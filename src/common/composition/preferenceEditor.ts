import { computed } from 'vue';
import { useStore } from 'vuex';
import { ActionTypes } from '../store/actionTypes';
import { GetterTypes } from '../store/getterTypes';

export default function usePreferenceEditor() {
  const store = useStore();
  const preferences = computed(() => store.getters[GetterTypes.PREFERENCES]);

  const togglePreference = (preference: keyof Api.Preferences) => {
    store.dispatch(ActionTypes.UPDATE_PREFERENCES, preference);
  };
  const getBooleanPreference = (pref: keyof Api.Preferences, fallback = false): boolean => {
    if (!preferences.value) {
      return fallback;
    }
    return preferences.value[pref];
  };

  return {
    preferences,
    togglePreference,
    getBooleanPreference,
  };
}
