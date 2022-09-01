import { sleep } from 'common/src/utils/time';
import { useAuthStore } from '../stores/useAuthStore';
import { usePreferencesStore } from '../stores/usePreferencesStore';
import { usePlayerConfig } from './usePlayerConfig';

export function useLogout() {
  const auth = useAuthStore();
  const prefs = usePreferencesStore();
  const config = usePlayerConfig();

  return async () => {
    await sleep(500); // Just slow the process down a little to seem more secure lol
    auth.clearTokens();
    prefs.resetToDefault();
    void config.usageClient.saveEvent('logout');
  };
}
