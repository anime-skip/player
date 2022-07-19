import { useClearTokens } from '~/stores/useAuth';
import { useResetPreferences } from '~/stores/useGeneralPreferences';
import UsageStats from '~/utils/UsageStats';
import { sleep } from '~utils/time';

export function useLogout() {
  const clearTokens = useClearTokens();
  const resetPreferences = useResetPreferences();

  return async () => {
    await sleep(500);
    clearTokens();
    resetPreferences();
    void UsageStats.saveEvent('logout');
  };
}
