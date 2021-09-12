import { browser } from 'webextension-polyfill-ts';
import { useWebExtensionStorage } from '../hooks/useWebExtensionStorage';

interface Auth {
  token?: string;
  refreshToken?: string;
}

export const AUTH_STORAGE_KEY = 'auth';
export const AUTH_STORAGE_LOCATION = 'local';

export function useAuth() {
  const { value: auth, updateValue: updateAuth } = useWebExtensionStorage<Auth>(
    AUTH_STORAGE_KEY,
    {},
    AUTH_STORAGE_LOCATION
  );

  return {
    auth,
    updateAuth,
  };
}

export function useIsLoggedIn() {
  const { auth } = useAuth();
  return computed(() => !!auth?.token);
}

export function useClearTokens() {
  const { updateAuth } = useAuth();
  return () => {
    updateAuth({
      token: null,
      refreshToken: null,
    });
  };
}

export async function updateAuthAsync(newAuth: Auth) {
  await browser.storage.local.set({ [AUTH_STORAGE_KEY]: newAuth });
}

export async function getAuthAsync(): Promise<Auth> {
  return (await browser.storage.local.get(AUTH_STORAGE_KEY))[AUTH_STORAGE_KEY];
}
