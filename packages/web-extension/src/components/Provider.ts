import { Component, defineComponent } from 'vue';

export function Provider(provideValues: () => void, child: Component): Component;
export function Provider(provideValues: Array<() => void>, child: Component): Component;
export function Provider(
  provideValues: (() => void) | Array<() => void>,
  child: Component
): Component {
  return defineComponent({
    setup() {
      if (Array.isArray(provideValues)) {
        provideValues.forEach(provideValue => provideValue());
      } else {
        provideValues();
      }
    },
    render() {
      return h(child);
    },
  });
}
