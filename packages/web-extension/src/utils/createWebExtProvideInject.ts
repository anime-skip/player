import { Ref } from 'vue';
import { usePlayerStorage } from '~/composables/usePlayerStorage';
import { AreaName } from './web-ext-storage';

// eslint-disable-next-line @typescript-eslint/ban-types
export function createWebExtProvideInject<T extends object>(
  label: string,
  _: AreaName,
  defaultValue: T
) {
  const valueKey = label + '-value';
  const updateKey = label + '-set-value';
  const provideValue = () => {
    const value = usePlayerStorage(label, defaultValue);
    const update = (newPartialValue: Partial<T>) => {
      const newValue = { ...value.value };
      for (const field in newPartialValue) {
        // @ts-expect-error: Bad key typing
        newValue[field] = newPartialValue[field];
      }
      value.value = newValue;
    };
    provide(valueKey, value);
    provide(updateKey, update);
  };

  function useValue(): Readonly<Ref<T>> {
    const value = inject<Ref<T>>(valueKey);
    if (value == null) throw Error(`Injected value has not been provided for ${label}`);
    return value;
  }

  function useUpdate(): (newValue: Partial<T>) => void {
    const update = inject<(newValue: Partial<T>) => void>(updateKey, () => {
      throw Error(`Injected update has not been provided for ${label}`);
    });
    return newValue => update({ ...newValue });
  }

  return {
    provideValue,
    useValue,
    useUpdate,
  };
}
