// eslint-disable-next-line @typescript-eslint/ban-types
export function createProvideInject<T extends object>(label: string, defaultValue: T) {
  const valueKey = label + '-value';
  const updateKey = label + '-update';

  function provideValue() {
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
