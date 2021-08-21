import { useWebExtensionStorage } from '../hooks/useWebExtensionStorage';

interface Auth {
  token?: string;
  tokenExpiresAt?: number;

  refreshToken?: string;
  refreshTokenExpiresAt?: number;
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
  // TODO: validate this is correct
  return computed(() => !!auth.value?.token);
}

export function useClearTokens() {
  const { updateAuth } = useAuth();
  return () => {
    updateAuth({
      token: undefined,
      refreshToken: undefined,
      refreshTokenExpiresAt: undefined,
      tokenExpiresAt: undefined,
    });
  };
}
