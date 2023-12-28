/**
 * Whether the player should auto-skip sections based on preferences and whether or not the player is editing.
 */
export default function () {
  const { pref } = useReadonlyPreference('enableAutoSkip');

  return computed<boolean>(() => !!pref.value);
}
