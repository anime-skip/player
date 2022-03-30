interface ProvideInject<T> {
  provideValue(): void;
  useValue(): Readonly<T>;
  useUpdate(): (newValue: Partial<T>) => void;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function createProvideInject<T extends object>(
  label: string,
  defaultValue: T
): ProvideInject<T>;
// eslint-disable-next-line @typescript-eslint/ban-types
export function createProvideInject<T extends object>(
  label: string,
  defaultValueFactory: () => T,
  defaultAsFactory: true
): ProvideInject<T>;
// eslint-disable-next-line @typescript-eslint/ban-types
export function createProvideInject<T extends object>(
  label: string,
  defaultValueFactory: T | (() => T),
  defaultAsFactory?: boolean
): ProvideInject<T> {
  const valueKey = label + '-value';
  const updateKey = label + '-update';

  function provideValue() {
    const defaultValue: T = defaultAsFactory
      ? (defaultValueFactory as () => T)()
      : (defaultValueFactory as T);
    const value = reactive(defaultValue);
    provide(valueKey, readonly(value));

    const update = (newValue: Partial<T>) => {
      for (const field in newValue) {
        // @ts-expect-error: Bad key typing
        value[field] = newValue[field];
      }
    };
    provide(updateKey, update);
  }

  function useValue(): Readonly<T> {
    const value = inject<T>(valueKey);
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
