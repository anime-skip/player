/**
 * Returns a global reference to which "view" is active. A "view" is the current dialog or panel
 * visible.
 *
 * To change views, set the value to `undefined`.
 */
export default createGlobalState(() =>
  ref<'timestamps' | 'settings' | undefined>(),
);
