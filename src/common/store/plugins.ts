import { createLogger } from 'vuex';
import { MutationTypes } from './mutationTypes';

export default process.env.NODE_ENV === 'production'
  ? undefined
  : [
      createLogger({
        filter: ({ type }) => {
          const ignored = [MutationTypes.SET_IS_ACTIVE, MutationTypes.SET_CURRENT_TIME];
          return !ignored.includes(type as MutationTypes);
        },
      }),
    ];
