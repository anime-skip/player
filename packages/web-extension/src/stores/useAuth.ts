import browser from 'webextension-polyfill';
import { createWebExtProvideInject } from '../utils/createWebExtProvideInject';

interface Auth {
  token?: string;
  refreshToken?: string;
}

export const AUTH_STORAGE_KEY = 'auth';
export const AUTH_STORAGE_LOCATION = 'local';

const {
  provideValue: provideAuth,
  useInitStorageListener: useInitAuthListener,
  useUpdate: useUpdateAuth,
  useValue: useAuth,
} = createWebExtProvideInject<Auth>(AUTH_STORAGE_KEY, AUTH_STORAGE_LOCATION, {
  token: undefined,
  refreshToken: undefined,
});

export { provideAuth, useInitAuthListener, useUpdateAuth, useAuth };

export function useIsLoggedIn() {
  const auth = useAuth();
  return computed(() => !!auth?.token);
}

export function useClearTokens() {
  const update = useUpdateAuth();
  return () => {
    update({
      token: undefined,
      refreshToken: undefined,
    });
  };
}

export async function updateAuthAsync(newAuth: Auth) {
  await browser.storage.local.set({ [AUTH_STORAGE_KEY]: newAuth });
}

export async function getAuthAsync(): Promise<Auth> {
  return (await browser.storage.local.get(AUTH_STORAGE_KEY))[AUTH_STORAGE_KEY] || {};
}
