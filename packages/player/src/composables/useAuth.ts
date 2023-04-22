import usePlayerStorage from './usePlayerStorage';

export default createSharedComposable(() => {
  const { storage } = usePlayerOptions();
  return usePlayerStorage(storage.auth);
});
