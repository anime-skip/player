import { usePlayerConfig } from './usePlayerConfig';

export function useApiClient() {
  const config = usePlayerConfig();
  return computed(() => config.apiClient);
}
