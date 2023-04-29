/**
 * A simple alias for `useIsEditing().stopEditing`.
 */
export default function () {
  const { stopEditing } = useIsEditing();
  return stopEditing;
}
