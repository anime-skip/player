import { createDecorator } from 'vue-class-component';

export function Getter(getterName: string) {
    return createDecorator((options, key) => {
        if (!options.computed) options.computed = {};
        options.computed[key] = function() {
            const store = this.$store as any;
            return store.getters[getterName];
        };
    });
}

export function Action(actionName: string) {
    return createDecorator((options, key) => {
        if (!options.methods) options.methods = {};
        options.methods[key] = function(payload: any) {
            return this.$store.dispatch(actionName, payload);
        };
    });
}

export function Mutation(mutationName: string) {
    return createDecorator((options, key) => {
        if (!options.methods) options.methods = {};
        options.methods[key] = function(payload: any) {
            console.log('Mutation:', mutationName, payload);
            return this.$store.commit(mutationName, payload);
        };
    });
}
