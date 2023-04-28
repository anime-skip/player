import { AllPreferences } from '../utils/preferences';
import usePreferences from './usePreferences';

/**
 * An alternative to `usePreference` that returns a readonly, reactive value.
 */
export default function <T extends keyof AllPreferences>(key: T) {
  const { state, ...asyncState } = usePreferences();
  const pref = computed(() => state.value?.[key]);
  return { ...asyncState, pref };
}
