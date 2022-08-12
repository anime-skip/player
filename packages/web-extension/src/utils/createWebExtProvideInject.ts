import isEqual from 'lodash.isequal';
import browser, { Storage } from 'webextension-polyfill';
import { createProvideInject } from '~utils/createProvideInject';
import { webExtStorage } from './web-ext-storage';

type AreaName = 'sync' | 'local' | 'managed';

// eslint-disable-next-line @typescript-eslint/ban-types
export function createWebExtProvideInject<T extends object>(
  label: string,
  area: AreaName,
  defaultValue: T
) {
  const {
    provideValue,
    useUpdate: rawUseUpdate,
    useValue,
  } = createProvideInject(label, defaultValue);

  const useUpdate = () => {
    const value = useValue();
    const rawUpdate = rawUseUpdate();
    return async function update(newValue: Partial<T>) {
      rawUpdate(newValue);
      await webExtStorage.setItem(label, { ...value, ...newValue });
    };
  };

  return {
    provideValue,
    useValue,
    useUpdate,
  };
}
