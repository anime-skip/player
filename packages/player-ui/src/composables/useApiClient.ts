import { usePlayerConfig } from './usePlayerConfig';

export function useApiClient() {
  return usePlayerConfig().useApiClient();
}
