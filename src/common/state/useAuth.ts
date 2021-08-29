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
      token: undefined,
      refreshToken: undefined,
    });
  };
}
