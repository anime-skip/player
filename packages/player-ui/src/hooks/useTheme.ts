import { ColorTheme } from '~/common/api';
import { useGeneralPreferences } from '~/common/state/useGeneralPreferences';

const staticThemeToServiceMap: Record<ColorTheme, Service | null> = {
  ANIME_SKIP_BLUE: null,
  PER_SERVICE: null,
  CRUNCHYROLL_ORANGE: 'crunchyroll',
  FUNIMATION_PURPLE: 'funimation',
  VRV_YELLOW: 'vrv',
};

const serviceToPerServiceTheme: Record<Service, Service | null> = {
  'funimation-2021-09-26': 'funimation',
  'test-service': null,
  crunchyroll: 'crunchyroll',
  funimation: 'funimation',
  vrv: 'vrv',
};

export function useTheme() {
  const prefs = useGeneralPreferences();
  const colorTheme = computed(() => prefs.value.colorTheme);

  const themeService = computed<Service | null>(() => {
    if (colorTheme.value === ColorTheme.PER_SERVICE) {
      return serviceToPerServiceTheme[window.service];
    }

    return staticThemeToServiceMap[colorTheme.value];
  });
  const themeClass = computed(() => `as-theme as-${themeService.value}-theme`);

  const showThemeLogo = computed(
    () =>
      themeService.value == null ||
      themeService.value === 'test-service' ||
      themeService.value === 'vrv'
  );
  return {
    themeClass,
    showThemeLogo,
  };
}
