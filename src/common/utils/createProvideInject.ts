export function createProvideInject<T>(label: string, defaultValue: T | (() => T)) {
  const valueKey = label + '-value';
  const updateKey = label + '-update';

  const getDefaultValue = (): T =>
    // @ts-expect-error: Bad type infer on function type
    typeof defaultValue !== 'function' ? defaultValue : defaultValue();

  function provideValue() {
    const value = readonly(reactive(ref(getDefaultValue())));
    provide(valueKey, readonly(value));

    const update = (newValue: T) => {
      // @ts-expect-error: bad ref typing, should be fine
      value.value = newValue;
    };
    provide(updateKey, update);
  }

  function useValue(): Readonly<T> {
    const value = inject<T>(valueKey);
    if (value == null) throw Error(`Injected value has not been provided for ${label}`);
    return value;
  }

  function useUpdate(): (newValue: Partial<T>) => void {
    const value = useValue();
    const update = inject<(newValue: T) => void>(updateKey, () => {
      throw Error(`Injected update has not been provided for ${label}`);
    });
    return newValue => {
      update({ ...value, ...newValue });
    };
  }

  return {
    provideValue,
    useValue,
    useUpdate,
  };
}
