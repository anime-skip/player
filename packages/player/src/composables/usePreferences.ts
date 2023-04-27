/**
 * Return reactive preferences. You can set the value, but don't set fields on the preferences.
 */
export default createSharedComposable(() => {
  const { storage } = usePlayerOptions();
  return usePlayerStorage(storage.preferences);
});
