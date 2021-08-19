export function createProvideInject<T>(label: string, defaultValue: T) {
  const valueKey = label + '-value';
  const updateKey = label + '-update';

  function provideValue() {
    const value = ref(defaultValue);
    provide(valueKey, value);

    const update = (newValue: T) => {
      // @ts-expect-error: bad ref typing, should be fine
      value.value = newValue;
    };
    provide(updateKey, update);
  }

  function useValue() {
    return inject<T>(valueKey, defaultValue);
  }

  function useUpdate() {
    return inject<(newValue: T) => void>(updateKey, () => {
      throw Error('Injected update has not been provided ');
    });
  }

  return {
    provideValue,
    useValue,
    useUpdate,
  };
}
