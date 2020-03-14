import { createDecorator, VueDecorator } from 'vue-class-component';

export function Getter(getterName?: string): VueDecorator {
  return createDecorator((options, key): void => {
    if (!options.computed) options.computed = {};
    options.computed[key] = function(): any {
      const store = this.$store as any;
      return store.getters[getterName || key];
    };
  });
}

export function Action(actionName?: string): VueDecorator {
  return createDecorator((options, key): void => {
    if (!options.methods) options.methods = {};
    options.methods[key] = function(payload: any): any {
      return this.$store.dispatch(actionName || key, payload);
    };
  });
}

export function Mutation(mutationName?: string): VueDecorator {
  return createDecorator((options, key): void => {
    if (!options.methods) options.methods = {};
    options.methods[key] = function(payload: any): any {
      return this.$store.commit(mutationName || key, payload);
    };
  });
}
