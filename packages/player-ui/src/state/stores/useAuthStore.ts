import { defineStore } from 'pinia';
import { usePlayerConfig } from '../../composables/usePlayerConfig';
import { usePlayerStorage } from '../../composables/usePlayerStorage';

const ACCESS_TOKEN_STORAGE_KEY = 'access-token';
const REFRESH_TOKEN_STORAGE_KEY = 'refresh-token';

export const useAuthStore = defineStore('auth', () => {
  const { storage } = usePlayerConfig();
  const accessToken = usePlayerStorage<string | undefined>(ACCESS_TOKEN_STORAGE_KEY, undefined);
  const refreshToken = usePlayerStorage<string | undefined>(REFRESH_TOKEN_STORAGE_KEY, undefined);

  /**
   * Set the tokens in the player storage in a async manner that can be awaited.
   */
  async function setTokensAsync(tokens: {
    accessToken: string | undefined;
    refreshToken: string | undefined;
  }) {
    await storage.setItem(ACCESS_TOKEN_STORAGE_KEY, tokens.accessToken);
    await storage.setItem(REFRESH_TOKEN_STORAGE_KEY, tokens.refreshToken);
  }

  const isLoggedIn = computed(() => !!accessToken.value);

  return {
    accessToken,
    refreshToken,
    isLoggedIn,
    setTokens: setTokensAsync,
  };
});
