import { ClientError } from 'graphql-request';
import { Ref } from 'vue';

export default function (error: Ref<unknown>) {
  return computed(() => {
    if (!error) return undefined;

    if (
      error.value instanceof ClientError &&
      error.value.response.errors?.[0]
    ) {
      return error.value.response.errors?.[0].message;
    }

    if (error.value instanceof Error) return error.value.message;

    return 'Unknown error message';
  });
}
