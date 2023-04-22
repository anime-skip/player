import { useMutation } from 'vue-query';

export default function () {
  return useMutation(useApiClient(false).login);
}
