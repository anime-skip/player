export function createProvideInject<T>(label: string, defaultValue: T) {
  const valueKey = label + '-value';
  const updateKey = label + '-update';

  function provideValue() {
    const value = readonly(reactive(ref(defaultValue)));
    provide(valueKey, readonly(value));

    const update = (newValue: T) => {
      // @ts-expect-error: bad ref typing, should be fine
      value.value = newValue;
    };
    provide(updateKey, update);
  }

  function useValue() {
    return inject<T>(valueKey, defaultValue) as Readonly<T>;
  }

  function useUpdate() {
    const value = useValue();
    const update = inject<(newValue: T) => void>(updateKey, () => {
      throw Error('Injected update has not been provided ');
    });
    return (newValue: Partial<T>) => {
      update({
        ...value,
        ...newValue,
      });
    };
  }

  return {
    provideValue,
    useValue,
    useUpdate,
  };
}
