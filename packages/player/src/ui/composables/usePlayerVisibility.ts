import { PlayerVisibility } from '../../types';
import { createAppState } from '../../utils/app-state';

export default createAppState(() => {
  const visibility = ref(PlayerVisibility.Visible);

  const { onVisibilityChange } = usePlayerOptions();
  watch(
    visibility,
    (newVisibility, oldVisibility) =>
      onVisibilityChange?.(
        newVisibility,
        oldVisibility ?? PlayerVisibility.Hidden,
      ),
    { immediate: true },
  );

  return visibility;
});
