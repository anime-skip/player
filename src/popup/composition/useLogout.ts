import { useClearTokens } from '~/common/state/useAuth';
import { useResetPreferences } from '~/common/state/useGeneralPreferences';
import { sleep } from '~/common/utils/time';
import UsageStats from '~/common/utils/UsageStats';

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
