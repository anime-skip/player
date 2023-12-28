import { ColorTheme } from '../utils/api';

/**
 * Manage the `data-theme` attribute on the shadow root. Should only be called once, so it's inside
 * a shared composable.
 */
export default createSharedComposable(() => {
  const { pref: theme } = useReadonlyPreference('colorTheme');
  const { shadowHtml } = useShadowRoot();
  const { serviceTheme } = usePlayerOptions();

  watch(
    theme,
    (newTheme) => {
      const themeName =
        newTheme === ColorTheme.PerService
          ? serviceTheme ?? ColorTheme.AnimeSkipBlue
          : newTheme;
      console.log({
        newTheme,
        PerService: ColorTheme.PerService,
        serviceTheme,
        themeName,
      });

      if (themeName) shadowHtml.setAttribute('data-theme', themeName);
      else shadowHtml.removeAttribute('data-theme');
    },
    { immediate: true },
  );
});
