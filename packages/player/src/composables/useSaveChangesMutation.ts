export default function () {
  const { state: auth } = useAuth();

  return useMutation(async () => {
    if (!auth.value) return;

    // TODO: Implement
  });
}
