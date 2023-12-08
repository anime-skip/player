/**
 * The current "view" show in the player.
 */
export type View =
  | 'timestamps'
  | 'edit-timestamp'
  | 'preferences'
  | 'all-preferences'
  | 'account'
  | 'edit-template';

/**
 * Returns a global reference to which "view" is active. A "view" is the current dialog or panel
 * visible. Only one "view" can be open at a time.
 *
 * To change views, set the value to `undefined`.
 */
export default createGlobalState(() => {
  const view = ref<View>();
  const { undo: goBack } = useRefHistory(view, { capacity: 1 });

  return { view, goBack };
});
