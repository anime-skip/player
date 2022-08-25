import { useClearTokens } from '../stores/useAuth';
import { useResetPreferences } from '../stores/useGeneralPreferences';
import { sleep } from 'common/src/utils/time';
import { usePlayerConfig } from './usePlayerConfig';

export function useLogout() {
  const clearTokens = useClearTokens();
  const resetPreferences = useResetPreferences();
  const { usageClient } = usePlayerConfig();

  return async () => {
    await sleep(500);
    clearTokens();
    resetPreferences();
    void usageClient.saveEvent('logout');
  };
}
