import { usePlayerConfig } from '../composables/usePlayerConfig';
import { useGeneralPreferences } from '../stores/useGeneralPreferences';
import { ColorTheme } from 'common/src/api';

const colorThemeToCssClassNameMap: Record<ColorTheme, string | undefined> = {
  ANIME_SKIP_BLUE: undefined,
  PER_SERVICE: undefined,
  CRUNCHYROLL_ORANGE: 'crunchyroll',
  FUNIMATION_PURPLE: 'funimation',
  VRV_YELLOW: 'vrv',
};

/**
 * A map between services and their associated color themes
 */
const serviceToTheme: Record<string, string | undefined> = {
  'funimation-2021-09-26': 'funimation',
  crunchyroll: 'crunchyroll',
  funimation: 'funimation',
  vrv: 'vrv',
};

export function useTheme() {
  const prefs = useGeneralPreferences();
  const { service } = usePlayerConfig();

  const themeService = computed(() => {
    const themePref = prefs.value.colorTheme;
    return themePref === ColorTheme.PER_SERVICE
      ? serviceToTheme[service]
      : colorThemeToCssClassNameMap[themePref];
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
