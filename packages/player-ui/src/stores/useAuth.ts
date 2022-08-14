import { webExtStorage } from '~/utils/web-ext-storage';
import { Auth } from '~types';
import { createWebExtProvideInject } from '../utils/createWebExtProvideInject';

export const AUTH_STORAGE_KEY = 'auth';
export const AUTH_STORAGE_LOCATION = 'local';

const {
  provideValue: provideAuth,
  useUpdate: useUpdateAuth,
  useValue: useAuth,
} = createWebExtProvideInject<Auth>(AUTH_STORAGE_KEY, AUTH_STORAGE_LOCATION, {
  token: undefined,
  refreshToken: undefined,
});

export { provideAuth, useUpdateAuth, useAuth };

export function useIsLoggedIn() {
  const auth = useAuth();
  return computed(() => !!auth.value?.token);
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

export function updateAuthAsync(newAuth: Auth) {
  return webExtStorage.setItem(AUTH_STORAGE_KEY, newAuth);
}

export function getAuthAsync(): Promise<Auth> {
  return webExtStorage.getItem<Auth>(AUTH_STORAGE_KEY).then(auth => auth || {});
}
