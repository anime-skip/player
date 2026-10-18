import { createAppState } from '../../utils/app-state';
import usePlayerStorage from './usePlayerStorage';

export default createAppState(() => {
  const { storage } = usePlayerOptions();
  return usePlayerStorage(storage.auth);
});
