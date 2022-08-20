import { Auth, PlayerStorage } from 'common/src/types';
import { createWebExtProvideInject } from '../utils/createWebExtProvideInject';

export const AUTH_STORAGE_KEY = 'auth';
export const AUTH_STORAGE_LOCATION = 'local';

const {
  provideValue: provideAuth,
  useUpdate: useUpdateAuth,
  useValue: useAuth,
} = createWebExtProvideInject<Auth>(AUTH_STORAGE_KEY, {
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

export async function updateAuthAsync(storage: PlayerStorage, newAuth: Auth) {
  await storage.setItem(AUTH_STORAGE_KEY, newAuth);
}

export async function getAuthAsync(storage: PlayerStorage): Promise<Auth> {
  return await storage.getItem<Auth>(AUTH_STORAGE_KEY, {});
}
