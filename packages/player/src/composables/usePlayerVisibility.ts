import { PlayerVisibility } from '../utils/PlayerVisibility';

export default createGlobalState(() => {
  const visibility = ref(PlayerVisibility.Visible);

  const { onVisibilityChange } = usePlayerOptions();
  watch(visibility, (newVisibility, oldVisibility) =>
    onVisibilityChange?.(newVisibility, oldVisibility),
  );

  return visibility;
});
