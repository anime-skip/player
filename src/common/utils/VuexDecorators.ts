import { createDecorator, VueDecorator } from 'vue-class-component';
import mutationTypes from '@/common/store/mutationTypes';
import actionTypes from '@/common/store/actionTypes';

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
      // @ts-ignore
      return this.$store.dispatch(actionTypes[actionName || key], payload);
    };
  });
}

export function Mutation(mutationName?: keyof typeof mutationTypes): VueDecorator {
  return createDecorator((options, key: any): void => {
    if (!options.methods) options.methods = {};
    // @ts-ignore
    options.methods[key] = function(payload: any): any {
      // @ts-ignore
      return this.$store.commit(mutationTypes[mutationName || key], payload);
    };
  });
}
