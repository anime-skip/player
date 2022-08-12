import { injectPlayerStorage } from '~/composables/usePlayerConfig';
import { createProvideInject } from '~utils/createProvideInject';
import { AreaName } from './web-ext-storage';

// eslint-disable-next-line @typescript-eslint/ban-types
export function createWebExtProvideInject<T extends object>(
  label: string,
  _: AreaName,
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
    const storage = injectPlayerStorage();
    return async function update(newValue: Partial<T>) {
      rawUpdate(newValue);
      await storage.setItem(label, { ...value, ...newValue });
    };
  };

  return {
    provideValue,
    useValue,
    useUpdate,
  };
}
