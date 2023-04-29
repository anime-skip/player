import useIsEditing from './useIsEditing';

/**
 * Whether the player should auto-skip sections based on preferences and whether or not the player is editing.
 */
export default function () {
  const { pref } = useReadonlyPreference('enableAutoSkip');
  const { isEditing } = useIsEditing();

  return computed<boolean>(() => !!pref.value && !isEditing.value);
}
