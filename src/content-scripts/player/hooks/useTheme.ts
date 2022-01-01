export function useTheme() {
  const themeService = ref<Service | null>('funimation');
  const isThemeApplied = ref(true);
  const themeClass = computed(() => `as-theme as-${themeService.value}-theme`);

  const showThemeLogo = themeService.value === 'test-service' || themeService.value === 'vrv';

  return {
    isThemeApplied,
    themeClass,
    showThemeLogo,
  };
}
