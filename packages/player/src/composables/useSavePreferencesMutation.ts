export default function () {
  const api = useApiClient(true);
  return useMutation(api.savePreferences);
}
