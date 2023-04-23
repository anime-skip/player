import { AllPreferences } from '../utils/preferences';

/**
 * An alternative to `usePreference` that returns a readonly, reactive value.
 */
export default function <T extends keyof AllPreferences>(key: T) {
  const { storage } = usePlayerOptions();
  const { value, ...asyncState } = usePlayerStorage(storage.preferences);
  const pref = computed(() => value.value?.[key]);
  return { ...asyncState, pref };
}
