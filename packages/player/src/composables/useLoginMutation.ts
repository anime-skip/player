import { useMutation } from 'vue-query';

export default function () {
  const { value: auth } = useAuth();

  return useMutation(useApiClient(false).login, {
    onSuccess(data) {
      auth.value = {
        refreshToken: data.login.refreshToken,
        token: data.login.authToken,
      };
    },
  });
}
