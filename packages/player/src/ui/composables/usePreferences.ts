import { createAppState } from '../../utils/app-state';

/**
 * Return reactive preferences. You can set the value, but don't set fields on
 * the preferences.
 */
export default createAppState(() => {
  const { storage } = usePlayerOptions();
  return usePlayerStorage(storage.preferences);
});
